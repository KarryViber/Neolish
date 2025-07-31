import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// Dify API Configuration for file upload
const DIFY_FILE_UPLOAD_ENDPOINT = 'https://ptminder.ptengine.com/v1/files/upload';
const DIFY_API_TOKEN_FOR_UPLOAD = process.env.NEXT_PUBLIC_DIFY_FLOW10_APP_TOKEN;

export async function POST(request: NextRequest) {
  console.log("POST /api/merchandise/upload called.");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('[Merchandise Upload API] Unauthorized: User email not found in session');
      return NextResponse.json({ error: 'Unauthorized: User email not found in session' }, { status: 401 });
    }
    const currentUserEmail = session.user.email;

    // 检查环境变量配置
    if (!DIFY_API_TOKEN_FOR_UPLOAD) {
      console.error('Dify API token for upload is not configured.');
      return NextResponse.json({ error: 'Dify API token for upload is not configured.' }, { status: 500 });
    }

    if (!DIFY_FILE_UPLOAD_ENDPOINT) {
      console.error('Dify file upload endpoint is not configured.');
      return NextResponse.json({ error: 'Dify file upload endpoint is not configured.' }, { status: 500 });
    }

    // 获取上传的文件
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 构建发送给Dify的FormData
    const difyUploadFormData = new FormData();
    difyUploadFormData.append('file', file, file.name);
    difyUploadFormData.append('user', currentUserEmail);

    console.log(`Uploading ${file.name} to Dify file API: ${DIFY_FILE_UPLOAD_ENDPOINT} by user: ${currentUserEmail}`);
    
    // 上传文件到Dify
    const difyUploadResponse = await fetch(DIFY_FILE_UPLOAD_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_TOKEN_FOR_UPLOAD}`,
      },
      body: difyUploadFormData,
    });

    if (!difyUploadResponse.ok) {
      let errorPayload: any = { message: `Dify file upload failed: ${difyUploadResponse.statusText}` };
      try {
        errorPayload = await difyUploadResponse.json();
      } catch (e) {
        console.warn("Could not parse Dify upload error response as JSON.");
      }
      throw new Error(errorPayload.message || errorPayload.error || `Dify file upload failed: ${difyUploadResponse.status}`);
    }

    const difyUploadResult = await difyUploadResponse.json();
    
    if (!difyUploadResult || typeof difyUploadResult !== 'object' || !difyUploadResult.id || !difyUploadResult.name) { 
      console.error("Dify upload API response is not a valid file object (expected id and name fields):", difyUploadResult);
      throw new Error('Invalid file object received from Dify upload API (missing id or name).');
    }

    console.log(`File uploaded to Dify, direct upload API response:`, difyUploadResult);
    
    // 确定文件类型
    let difyFileType = "document"; 
    if (difyUploadResult.mime_type && typeof difyUploadResult.mime_type === 'string') {
      if (difyUploadResult.mime_type.startsWith('image/')) {
        difyFileType = "image";
      } else if (difyUploadResult.mime_type === 'application/pdf' || 
                 difyUploadResult.mime_type === 'text/plain' ||
                 difyUploadResult.mime_type === 'application/msword' ||
                 difyUploadResult.mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                 difyUploadResult.mime_type === 'text/csv') {
        difyFileType = "document"; 
      }
    }

    // 构建Dify Flow需要的文件对象
    const difyFlowFileObject = {
      type: difyFileType,                 
      transfer_method: "local_file",       
      url: "", 
      upload_file_id: difyUploadResult.id,    
      filename: file.name // 使用原始文件名
    };

    return NextResponse.json({
      success: true,
      difyFileObject: difyFlowFileObject,
      originalFileName: file.name
    });

  } catch (error: any) {
    console.error("Error in /api/merchandise/upload POST handler:", error);
    return NextResponse.json({ 
      error: error.message || "An unknown server error occurred during file upload." 
    }, { status: 500 });
  }
} 