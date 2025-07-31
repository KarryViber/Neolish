import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 解析FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const articleId = formData.get('articleId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      }, { status: 400 });
    }

    // 验证文件大小 (限制为5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // 创建文件名（添加时间戳避免冲突）
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${path.basename(file.name, fileExtension)}_${timestamp}${fileExtension}`;

    // 创建存储目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles', articleId);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 保存文件
    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // 生成访问URL - 使用新的API路由
    const imageUrl = `/api/uploads/articles/${articleId}/${fileName}`;

    console.log(`[Image Upload] Successfully uploaded file for article ${articleId}: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error: any) {
    console.error('[Image Upload] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image', 
      details: error.message 
    }, { status: 500 });
  }
} 