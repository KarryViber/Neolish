import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 生成随机激活码的函数
function generateActivationCode(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 创建万能激活码的验证模式
const createUniversalCodeSchema = z.object({
  email: z.string().refine((email) => {
    // 允许空字符串或有效的邮箱格式
    return email === "" || z.string().email().safeParse(email).success;
  }, "Invalid email address").optional(),
  description: z.string().optional(),
});

// GET - 获取所有万能激活码（需要管理员权限）
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查用户是否是系统管理员（这里简化为检查是否有任何团队的所有者权限）
    const userMemberships = await prisma.membership.findMany({
      where: {
        userId: session.user.id,
        role: 'OWNER'
      }
    });

    if (userMemberships.length === 0) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const universalCodes = await prisma.activationCode.findMany({
      where: {
        isUniversal: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(universalCodes, { status: 200 });

  } catch (error) {
    console.error("Error fetching universal activation codes:", error);
    return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 });
  }
}

// POST - 创建万能激活码（需要管理员权限）
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查用户是否是系统管理员
    const userMemberships = await prisma.membership.findMany({
      where: {
        userId: session.user.id,
        role: 'OWNER'
      }
    });

    if (userMemberships.length === 0) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const json = await req.json();
    
    // 更灵活的验证：允许空字符串或undefined
    let email = json.email;
    if (email && typeof email === 'string') {
      email = email.trim();
      // 如果不是空字符串，验证邮箱格式
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ 
          error: 'Invalid email format'
        }, { status: 400 });
      }
    }

    // 生成唯一的激活码
    let code: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = generateActivationCode();
      const existingCode = await prisma.activationCode.findUnique({
        where: { code }
      });
      isUnique = !existingCode;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      return NextResponse.json({ 
        error: 'Failed to generate unique code. Please try again.' 
      }, { status: 500 });
    }

    const newCode = await prisma.activationCode.create({
      data: {
        code: code!,
        email: email || '*', // 使用 * 表示任意邮箱
        isUniversal: true,
        teamId: null // 万能激活码不绑定团队
      }
    });

    return NextResponse.json(newCode, { status: 201 });

  } catch (error) {
    console.error("Error creating universal activation code:", error);
    return NextResponse.json({ error: 'Failed to create code' }, { status: 500 });
  }
}

// DELETE - 删除万能激活码（需要管理员权限）
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 检查用户是否是系统管理员
    const userMemberships = await prisma.membership.findMany({
      where: {
        userId: session.user.id,
        role: 'OWNER'
      }
    });

    if (userMemberships.length === 0) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const url = new URL(req.url);
    const codeId = url.searchParams.get('id');

    if (!codeId) {
      return NextResponse.json({ error: 'Code ID is required' }, { status: 400 });
    }

    await prisma.activationCode.delete({
      where: {
        id: codeId,
        isUniversal: true // 确保只能删除万能激活码
      }
    });

    return NextResponse.json({ message: 'Code deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error("Error deleting universal activation code:", error);
    return NextResponse.json({ error: 'Failed to delete code' }, { status: 500 });
  }
} 