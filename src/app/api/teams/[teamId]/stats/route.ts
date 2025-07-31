import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;

    // Check if user is a member of the team
    const membership = await prisma.membership.findUnique({
      where: {
        userId_teamId: {
          userId: session.user.id,
          teamId: teamId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch team statistics
    const [
      totalMembers,
      totalArticles,
      totalImages,
      totalStyleProfiles,
      totalAudiences,
    ] = await Promise.all([
      prisma.membership.count({
        where: { teamId },
      }),
      prisma.article.count({
        where: { teamId },
      }),
      prisma.imageGenerationJob.count({
        where: { teamId },
      }),
      prisma.styleProfile.count({
        where: { teamId },
      }),
      prisma.audience.count({
        where: { teamId },
      }),
    ]);

    return NextResponse.json({
      totalMembers,
      totalArticles,
      totalImages,
      totalStyleProfiles,
      totalAudiences,
    });

  } catch (error) {
    console.error('Error fetching team stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 