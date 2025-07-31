import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { articleId } = await params;
    const requestBody = await req.json();
    
    const {
      platforms,
      coverImage,
      tweetThread,
      publishAt,
    } = requestBody;

    console.log('Publishing article:', articleId, 'for user:', session.user.email);
    console.log('Platforms:', platforms);

    // Verify the article exists and belongs to the user's team
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        team: {
          memberships: {
            some: {
              userId: session.user.id
            }
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found or access denied' },
        { status: 404 }
      );
    }

    // Prepare publishing metadata
    const publishingMetadata = {
      platforms: platforms || [],
      publishedAt: new Date().toISOString(),
      coverImage: coverImage ? {
        type: typeof coverImage === 'string' ? 'base64' : 'file',
        data: coverImage
      } : null,
      tweetThread: tweetThread || null,
      publishAt: publishAt || null,
      publishedBy: session.user.email
    };

    // Update the article status and add publishing metadata
    const currentStructuredContent = (article.structuredContent as Record<string, any>) || {};
    const updatedStructuredContent = {
      ...currentStructuredContent,
      publishing: publishingMetadata
    };

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: 'published',
        structuredContent: updatedStructuredContent,
        updatedAt: new Date()
      }
    });

    console.log('Article published successfully:', articleId);

    // Simulate platform-specific publishing results
    const publishResults = platforms.map((platform: string) => ({
      platform,
      success: true,
      message: `Successfully published to ${platform}`,
      publishedAt: new Date().toISOString()
    }));

    return NextResponse.json({
      success: true,
      message: 'Article published successfully',
      article: {
        id: updatedArticle.id,
        status: updatedArticle.status,
        publishedAt: publishingMetadata.publishedAt
      },
      publishResults
    });

  } catch (error: any) {
    console.error('Error publishing article:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to publish article',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 