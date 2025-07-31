import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 修正后的导入
import axios from 'axios';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from '@/lib/authOptions'; // Updated import path

// Dify API 配置 (从环境变量读取)
const DIFY_API_KEY = process.env.DIFY_FLOW6_APP_TOKEN || '';
const DIFY_API_ENDPOINT = process.env.DIFY_API_ENDPOINT; // Use the new endpoint variable

export async function POST(request: NextRequest) {
  let jobId: string | null = null; // Initialize jobId to null

  try {
    // Get session and user email first
    const session = await getServerSession(authOptions); // Get session
    if (!session || !session.user?.id || !session.user?.email) { // Check for both id and email
      console.error('[Images Generate API] Unauthorized: User ID or Email not found in session');
      return NextResponse.json({ error: 'Unauthorized: User ID or Email not found in session' }, { status: 401 });
    }
    const userId = session.user.id; // For Prisma relation
    const userEmailForDify = session.user.email; // For Dify API user parameter

    const body = await request.json();
    const { prompt, placeholderTag, articleId, teamId } = body;

    if (!prompt || !placeholderTag) { // articleId 是可选的，但最好有
      return NextResponse.json({ error: 'Missing prompt or placeholderTag' }, { status: 400 });
    }
    if (!teamId) {
      return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });
    }
    if (!DIFY_API_KEY || !DIFY_API_ENDPOINT) {
      console.error('Dify API credentials or endpoint not configured on server.');
      return NextResponse.json({ error: 'Image generation service not configured' }, { status: 500 });
    }

    // 1. 创建初始 Job 记录
    const initialJobData: any = {
        placeholderTag,
        prompt,
        status: 'triggering_dify',
        team: { connect: { id: teamId } }, 
        user: { connect: { id: userId } }, 
    };
    if (articleId) {
        initialJobData.article = { connect: { id: articleId } }; 
    }

    let job = await prisma.imageGenerationJob.create({ data: initialJobData });
    jobId = job.id; // 保存 job ID 以便出错时更新

    // 2. 调用 Dify (blocking mode)
    console.log(`Calling Dify for job ${jobId}, placeholder: ${placeholderTag}`);
    const difyResponse = await fetch(DIFY_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { image_prompt_text: prompt },
        response_mode: 'blocking',
        user: userEmailForDify, // Corrected: Use user's email for Dify
      }),
    });

    const difyJson = await difyResponse.json();
    console.log(`Dify response for job ${jobId}:`, JSON.stringify(difyJson, null, 2));

    const difyWorkflowRunId = difyJson.workflow_run_id;
    const difyTaskId = difyJson.task_id;

    // 3. 处理 Dify 响应
    if (difyJson.data?.status === 'succeeded' && difyJson.data.outputs?.files?.[0]?.url) {
      const temporaryDifyImageUrl = difyJson.data.outputs.files[0].url;
      const mimeType = difyJson.data.outputs.files[0].mime_type || 'image/png'; // Default MIME type

      console.log(`Job ${jobId}: Dify success, image URL: ${temporaryDifyImageUrl}, MIME: ${mimeType}`);
      await prisma.imageGenerationJob.update({
        where: { id: jobId },
        data: { 
          status: 'processing_image', 
          originalDifyImageUrl: temporaryDifyImageUrl, 
          difyWorkflowRunId, 
          difyTaskId,
          mimeType: mimeType // Store mimeType
        },
      });

      // 4. 下载图片
      let imageBase64Data: string | null = null;
      try {
        console.log(`Job ${jobId}: Downloading image from ${temporaryDifyImageUrl}`);
        const imageResponse = await axios.get(temporaryDifyImageUrl, {
          responseType: 'arraybuffer',
          timeout: 30000, // 30秒超时
        });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
        imageBase64Data = imageBuffer.toString('base64');
        console.log(`Job ${jobId}: Image downloaded and converted to Base64 (length: ${imageBase64Data?.length})`);

        // 5. 更新 Job 为成功，并带上图片数据
        job = await prisma.imageGenerationJob.update({
          where: { id: jobId },
          data: {
            status: 'succeeded',
            imageBase64: imageBase64Data, // 存储原始 Base64
          },
        });

        return NextResponse.json({
          status: 'succeeded',
          jobId: job.id, // Return jobId
          placeholderTag: placeholderTag,
        }, { status: 200 });

      } catch (downloadError: any) {
        console.error(`Job ${jobId}: Failed to download or process image from ${temporaryDifyImageUrl}:`, downloadError.message);
        await prisma.imageGenerationJob.update({
          where: { id: jobId },
          data: {
            status: 'failed',
            errorMessage: `Failed to download/process Dify image: ${downloadError.message}`,
          },
        });
        return NextResponse.json({
          status: 'failed',
          error: `Failed to download or process image from Dify: ${downloadError.message}`,
          jobId: jobId,
          placeholderTag: placeholderTag,
        }, { status: difyResponse.status === 200 ? 500 : difyResponse.status });
      }
    } else {
      // Dify 工作流失败或返回非预期结构
      const errorMessage = difyJson.data?.error || difyJson.message || 'Dify workflow failed or returned unexpected structure.';
      console.error(`Job ${jobId}: Dify workflow error - ${errorMessage}`, difyJson);
      await prisma.imageGenerationJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          errorMessage: errorMessage,
          difyWorkflowRunId,
          difyTaskId,
        },
      });
      return NextResponse.json({ 
        status: 'failed', 
        error: errorMessage, 
        jobId: jobId, 
        placeholderTag: placeholderTag 
      }, { status: difyResponse.status === 200 ? 500 : difyResponse.status });
    }
  } catch (error: any) {
    console.error('Error in /api/images/generate POST handler:', error);
    if (jobId) {
      try {
        await prisma.imageGenerationJob.update({
          where: { id: jobId },
          data: {
            status: 'failed',
            errorMessage: error.message || 'An unknown server error occurred during image generation.',
          },
        });
      } catch (updateError) {
        console.error(`Job ${jobId}: Failed to update job status to failed after main error:`, updateError);
      }
    }
    return NextResponse.json({ error: error.message || 'An unknown server error occurred.' }, { status: 500 });
  }
}