import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { lookup } from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // await params since it's now a Promise in Next.js 15
    const resolvedParams = await params;
    // 构建文件路径
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...resolvedParams.path);
    
    // 检查文件是否存在
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // 读取文件
    const fileBuffer = readFileSync(filePath);
    
    // 获取MIME类型
    const mimeType = lookup(filePath) || 'application/octet-stream';
    
    // 返回文件
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 