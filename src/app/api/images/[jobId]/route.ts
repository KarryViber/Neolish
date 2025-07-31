import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  console.log(`GET /api/images/${jobId} called.`);

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const memberships = await prisma.membership.findMany({
      where: { userId: userId },
      select: { teamId: true },
    });
    const userTeamIds = memberships.map(m => m.teamId);

    if (userTeamIds.length === 0) {
      return NextResponse.json({ error: 'Forbidden: User not in any team' }, { status: 403 });
    }

    const job = await prisma.imageGenerationJob.findUnique({
      where: { 
        id: jobId,
        teamId: {
          in: userTeamIds,
        }
      },
      select: { imageBase64: true, mimeType: true, status: true, teamId: true },
    });

    if (!job) {
      console.log(`Job ${jobId} not found or not accessible by user ${userId}.`);
      return NextResponse.json({ error: 'Image job not found or not accessible' }, { status: 404 });
    }

    if (job.status !== 'succeeded' || !job.imageBase64 || !job.mimeType) {
      console.log(`Job ${jobId} not ready or data missing. Status: ${job.status}`);
      return NextResponse.json({ error: 'Image not ready or essential data missing' }, { status: 404 });
    }

    const imageBuffer = Buffer.from(job.imageBase64, 'base64');
    console.log(`Job ${jobId}: Successfully prepared image buffer for response. MimeType: ${job.mimeType}`);
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': job.mimeType,
        'Content-Length': imageBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error(`Error fetching image for job ${jobId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch image', details: error.message }, { status: 500 });
  }
} 