import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 解析表单数据
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');
    await mkdir(uploadDir, { recursive: true });

    // 生成唯一文件名
    const fileExtension = path.extname(file.name);
    const fileName = `${session.user.id}_${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 生成文件访问URL - 使用API路由确保正确提供服务
    const avatarUrl = `/api/uploads/avatars/${fileName}`;

    // 更新数据库中的用户头像
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json({ 
      success: true, 
      avatarUrl 
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 验证用户认证
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 从数据库中移除头像
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: null },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Avatar removed successfully' 
    });

  } catch (error) {
    console.error('Avatar deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to remove avatar' },
      { status: 500 }
    );
  }
} 