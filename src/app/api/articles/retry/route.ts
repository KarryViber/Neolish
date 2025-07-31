import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 导入队列处理器类型
// 这里我们需要重新定义或者从主文件导入

const retrySchema = z.object({
  articleIds: z.array(z.string().min(1)),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = retrySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { articleIds } = validation.data;

    // 获取用户的团队
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      select: { teamId: true },
    });
    const userTeamIds = memberships.map(m => m.teamId);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ 
        error: 'User has no team access' 
      }, { status: 403 });
    }

    // 查找失败的文章
    const failedArticles = await prisma.article.findMany({
      where: {
        id: { in: articleIds },
        teamId: { in: userTeamIds },
        status: 'generation_failed'
      },
      include: {
        outline: true,
        styleProfile: true
      }
    });

    if (failedArticles.length === 0) {
      return NextResponse.json({ 
        error: 'No eligible articles found for retry' 
      }, { status: 404 });
    }

    const retriedArticles: string[] = [];
    const retryErrors: { articleId: string, error: string }[] = [];

    // 由于我们不能直接导入队列类，我们需要重新创建任务参数并调用队列
    // 这里我们简化处理：直接更新状态为queued，让现有的轮询机制处理
    for (const article of failedArticles) {
      try {
        if (!article.outline || !article.styleProfile) {
          retryErrors.push({
            articleId: article.id,
            error: 'Missing required outline or style profile data'
          });
          continue;
        }

        // 重置文章状态为排队
        await prisma.article.update({
          where: { id: article.id },
          data: {
            status: 'queued',
            content: '', // 清除错误信息
            updatedAt: new Date() // 更新时间戳
          }
        });

        // 重新创建任务参数并添加到队列
        // 由于我们需要重构队列系统为独立模块，这里暂时使用简化方法
        // TODO: 重构队列系统为独立的服务模块

        retriedArticles.push(article.id);
        console.log(`[Retry] Article ${article.id} queued for retry`);

      } catch (error: any) {
        console.error(`[Retry] Failed to retry article ${article.id}:`, error);
        retryErrors.push({
          articleId: article.id,
          error: error.message || 'Unknown error'
        });
      }
    }

    if (retriedArticles.length > 0) {
      return NextResponse.json({
        message: `Successfully queued ${retriedArticles.length} article(s) for retry`,
        retriedArticles,
        retryErrors: retryErrors.length > 0 ? retryErrors : undefined
      }, { status: 200 });
    } else {
      return NextResponse.json({
        error: 'Failed to retry any articles',
        details: retryErrors
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in retry API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
} 