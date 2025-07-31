import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// 导入或重新定义队列处理器
enum ArticleStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing', 
  DRAFT = 'draft',
  GENERATION_FAILED = 'generation_failed',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

async function processQueuedArticle(articleId: string) {
  console.log(`[Process Queue] Starting processing for article ${articleId}`);
  
  try {
    // 获取文章详细信息
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        outline: true,
        styleProfile: true,
        user: true
      }
    });

    if (!article) {
      throw new Error('Article not found');
    }

    if (article.status !== ArticleStatus.QUEUED) {
      console.log(`[Process Queue] Article ${articleId} is not queued (status: ${article.status}), skipping`);
      return;
    }

    if (!article.outline || !article.styleProfile || !article.user) {
      throw new Error('Missing required data (outline, styleProfile, or user)');
    }

    // 更新状态为处理中
    await prisma.article.update({
      where: { id: articleId },
      data: { status: ArticleStatus.PROCESSING }
    });

    // 准备 Dify 调用参数
    const difyStyleProfileObject = {
      source_url: (article.styleProfile as any).sourceUrl || "",
      author_profile: article.styleProfile.authorInfo ? 
        JSON.parse(JSON.stringify(article.styleProfile.authorInfo)) : 
        { name: "Default Author", summary: [], links: [] },
      style_summary: article.styleProfile.styleFeatures ? 
        JSON.parse(JSON.stringify(article.styleProfile.styleFeatures)) : 
        { summary_points: [] },
      sample_texts: article.styleProfile.sampleText ? [article.styleProfile.sampleText] : [],
      writing_style: (article.styleProfile as any).writingStyle || "default",
    };

    // 从 targetAudienceIds 获取受众信息（简化处理）
    let audienceName = 'General Audience';
    if (article.targetAudienceIds && article.targetAudienceIds.length > 0) {
      const firstAudienceId = (article.targetAudienceIds as string[])[0];
      const audience = await prisma.audience.findUnique({
        where: { id: firstAudienceId },
        select: { name: true }
      });
      if (audience) {
        audienceName = audience.name;
      }
    }

    const difyTargetAudienceObject = { 
      audience_name: audienceName, 
      description: "", 
      tags: [] 
    };

    const writingPurpose = (article.writingPurpose as string[])[0] || 'General Purpose';

    // 调用 Dify API
    const difyPayload = {
      inputs: {
        user_email: article.user.email,
        outline: article.outline.content,
        style_profile: JSON.stringify(difyStyleProfileObject),
        writing_purpose: writingPurpose,
        target_audience: JSON.stringify(difyTargetAudienceObject),
      },
      response_mode: "blocking",
      user: article.user.email,
    };

    const endpoint = process.env.DIFY_API_ENDPOINT;
    const token = process.env.DIFY_FLOW4_APP_TOKEN;

    if (!endpoint || !token) {
      throw new Error('Dify endpoint or token missing');
    }

    console.log(`[Process Queue] Calling Dify API for article ${articleId}`);
    
    const difyResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(difyPayload),
      signal: AbortSignal.timeout(300000) // 5分钟超时
    });

    if (!difyResponse.ok) {
      const errorBody = await difyResponse.text();
      throw new Error(`Dify API error: ${difyResponse.status} - ${errorBody}`);
    }

    const difyResult = await difyResponse.json();
    
    if (difyResult.data && difyResult.data.status === 'succeeded') {
      if (difyResult.data.outputs && typeof difyResult.data.outputs.generated_article === 'string') {
        const generatedArticleContent = difyResult.data.outputs.generated_article;
        const imagePromptsStructured = difyResult.data.outputs.structured_output || null;
        
        await prisma.article.update({
          where: { id: articleId },
          data: {
            content: generatedArticleContent,
            structuredContent: imagePromptsStructured === null ? Prisma.JsonNull : imagePromptsStructured,
            status: ArticleStatus.DRAFT,
          },
        });
        
        console.log(`[Process Queue] Article ${articleId} generation completed successfully`);
      } else {
        throw new Error('Invalid Dify response: missing generated_article');
      }
    } else {
      const difyError = difyResult.data?.error || difyResult.error?.message || 'Unknown Dify workflow error';
      throw new Error(`Dify workflow failed: ${difyError}`);
    }
  } catch (error: any) {
    console.error(`[Process Queue] Task failed for article ${articleId}:`, error);
    
    await prisma.article.update({
      where: { id: articleId },
      data: { 
        status: ArticleStatus.GENERATION_FAILED,
        content: `Generation failed: ${error.message}`
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取用户的团队
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      select: { teamId: true },
    });
    const userTeamIds = memberships.map(m => m.teamId);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ 
        message: 'No teams found for user' 
      }, { status: 200 });
    }

    // 查找排队中的文章
    const queuedArticles = await prisma.article.findMany({
      where: {
        teamId: { in: userTeamIds },
        status: ArticleStatus.QUEUED
      },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
      take: 5 // 一次最多处理5篇文章
    });

    if (queuedArticles.length === 0) {
      return NextResponse.json({ 
        message: 'No queued articles found' 
      }, { status: 200 });
    }

    console.log(`[Process Queue] Found ${queuedArticles.length} queued articles to process`);

    // 并行处理文章（但有限制）
    const processingPromises = queuedArticles.map(article => 
      processQueuedArticle(article.id).catch(error => {
        console.error(`Failed to process article ${article.id}:`, error);
        return { articleId: article.id, error: error.message };
      })
    );

    const results = await Promise.allSettled(processingPromises);
    
    return NextResponse.json({
      message: `Initiated processing for ${queuedArticles.length} articles`,
      processedArticleIds: queuedArticles.map(a => a.id),
      results: results.map((result, index) => ({
        articleId: queuedArticles[index].id,
        status: result.status,
        error: result.status === 'rejected' ? result.reason : undefined
      }))
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in process-queue API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
} 