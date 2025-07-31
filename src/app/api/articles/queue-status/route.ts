import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

// 引入队列管理器（需要从主文件导出）
// 这里我们需要重新定义或者导入队列状态，因为我们不能直接从route.ts导入类
// 更简单的方法是直接查询数据库

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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
        queuedCount: 0, 
        processingCount: 0, 
        totalPendingCount: 0,
        articles: [] 
      });
    }

    // 查询排队和处理中的文章
    const [queuedArticles, processingArticles] = await Promise.all([
      prisma.article.findMany({
        where: {
          teamId: { in: userTeamIds },
          status: 'queued'
        },
        select: {
          id: true,
          title: true,
          status: true,
          writingPurpose: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.article.findMany({
        where: {
          teamId: { in: userTeamIds },
          status: 'processing'
        },
        select: {
          id: true,
          title: true,
          status: true,
          writingPurpose: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'asc' }
      })
    ]);

    // 计算平均处理时间（基于最近完成的文章）
    const recentCompletedArticles = await prisma.article.findMany({
      where: {
        teamId: { in: userTeamIds },
        status: 'draft',
        updatedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 最近24小时
        }
      },
      select: {
        createdAt: true,
        updatedAt: true
      },
      take: 10
    });

    let averageProcessingTime = null;
    if (recentCompletedArticles.length > 0) {
      const totalTime = recentCompletedArticles.reduce((sum, article) => {
        return sum + (new Date(article.updatedAt).getTime() - new Date(article.createdAt).getTime());
      }, 0);
      averageProcessingTime = Math.round(totalTime / recentCompletedArticles.length / 1000); // 转换为秒
    }

    // 估算排队文章的预计完成时间
    const queuedWithEstimates = queuedArticles.map((article, index) => ({
      ...article,
      estimatedStartTime: averageProcessingTime ? 
        new Date(Date.now() + (index * averageProcessingTime * 1000)).toISOString() : null,
      positionInQueue: index + 1
    }));

    return NextResponse.json({
      queuedCount: queuedArticles.length,
      processingCount: processingArticles.length,
      totalPendingCount: queuedArticles.length + processingArticles.length,
      averageProcessingTimeSeconds: averageProcessingTime,
      articles: {
        queued: queuedWithEstimates,
        processing: processingArticles
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error fetching queue status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue status' },
      { status: 500 }
    );
  }
} 