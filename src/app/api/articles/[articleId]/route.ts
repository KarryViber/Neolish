import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// --- GET Handler (Moved and Updated) ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> } // Updated type
) {
  const { articleId } = await params; // Await and destructure params
  console.log(`GET /api/articles/${articleId} called.`);

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  try {
    // --- Team Check ---
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
    // --- End Team Check ---

    const article = await prisma.article.findFirst({
      where: { 
        id: articleId,
        teamId: { in: userTeamIds } // Verify team membership
      },
      select: {
        id: true,
        title: true,
        content: true,
        structuredContent: true,
        contentAnalyst: true,
        status: true,
        updatedAt: true,
        writingPurpose: true,
        targetAudienceIds: true,
        styleProfile: {
          select: {
            id: true,
            name: true,
            description: true,
            authorInfo: true,
            styleFeatures: true,
            sampleText: true,
          }
        },
        // teamId: true, // Optionally select teamId for logging/verification
      },
    });

    if (!article) {
      console.warn(`Article not found with ID: ${articleId} or user ${userId} lacks access.`);
      return NextResponse.json({ error: 'Article not found or access denied' }, { status: 404 });
    }

    // 获取目标受众的名称信息
    let targetAudienceNames: string[] = [];
    if (article.targetAudienceIds && Array.isArray(article.targetAudienceIds) && article.targetAudienceIds.length > 0) {
      const audiences = await prisma.audience.findMany({
        where: {
          id: { in: article.targetAudienceIds }
        },
        select: { id: true, name: true }
      });
      targetAudienceNames = audiences.map(aud => aud.name);
    }

    const processedArticle = {
        ...article,
        structuredContent: article.structuredContent === null ? null : article.structuredContent as Record<string, string> | null,
        targetAudienceNames, // 添加目标受众名称列表
    };

    console.log(`Returning article data for ID: ${articleId}`);
    return NextResponse.json({ article: processedArticle });

  } catch (error: any) {
    console.error(`Error fetching article ${articleId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch article', details: error.message },
      { status: 500 }
    );
  }
}

// --- PUT Handler (Moved and Updated) ---
const updateArticleSchema = z.object({
  content: z.string().optional(),
  structuredContent: z.record(z.any()).nullable().optional(), 
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> } // Updated type
) {
  const { articleId } = await params; // Await and destructure params
  console.log(`PUT /api/articles/${articleId} called.`);

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    console.error('Invalid request body for PUT: Not JSON', error);
    return NextResponse.json({ error: 'Invalid request body: must be JSON.' }, { status: 400 });
  }
  
  const validation = updateArticleSchema.safeParse(requestBody);

  if (!validation.success) {
    console.error(`Invalid request body for PUT ${articleId}: Validation failed`, validation.error.format());
    return NextResponse.json(
      { error: 'Invalid request body', details: validation.error.format() },
      { status: 400 }
    );
  }

  const dataToUpdate: Prisma.ArticleUpdateInput = {};
  if (validation.data.content !== undefined) {
      dataToUpdate.content = validation.data.content;
  }
  if (validation.data.structuredContent !== undefined) {
      dataToUpdate.structuredContent = validation.data.structuredContent === null 
          ? Prisma.JsonNull 
          : validation.data.structuredContent as Prisma.JsonObject;
  }

  if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: 'No fields provided to update.' }, { status: 400 });
  }

  try {
    // --- Team Check ---
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
    // --- End Team Check ---

    // First, verify the article exists and belongs to the user's team
    const articleToUpdate = await prisma.article.findFirst({
        where: {
            id: articleId,
            teamId: { in: userTeamIds },
        },
        select: { id: true } // Only need ID for verification
    });

    if (!articleToUpdate) {
        console.log(`Article ${articleId} not found or user ${userId} lacks permission to update.`);
        return NextResponse.json({ error: 'Article not found or access denied' }, { status: 404 });
    }

    // If verification passes, proceed with the update
    const updatedArticle = await prisma.article.update({
      where: { id: articleId }, // No need to repeat team check here, already verified
      data: dataToUpdate,
      select: { 
          id: true,
          title: true,
          content: true,
          structuredContent: true,
          contentAnalyst: true,
          status: true,
          updatedAt: true,
          writingPurpose: true,
          targetAudienceIds: true,
      }
    });

    console.log(`Article ${articleId} updated successfully by user ${userId}.`);
    return NextResponse.json({ article: updatedArticle });

  } catch (error: any) {
    // P2025 can still happen if the record is deleted between check and update (rare)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        console.warn(`Article ${articleId} not found for update (possibly deleted concurrently).`);
        return NextResponse.json({ error: 'Article not found for update.' }, { status: 404 });
    }
    console.error(`Error updating article ${articleId}:`, error);
    return NextResponse.json(
      { error: 'Failed to update article', details: error.message },
      { status: 500 }
    );
  }
}

// --- DELETE Handler (Existing) ---
export async function DELETE(
  req: NextRequest, // param name is req here
  { params }: { params: Promise<{ articleId: string }> } // Updated type
) {
  const { articleId } = await params; // Await and destructure params

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  console.log(`DELETE /api/articles/${articleId} called.`);

  try {
    // --- Get user session and team IDs ---
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
      // Should not happen for a logged-in user in a team-based system, but safety check
      return NextResponse.json({ error: 'Forbidden: User not associated with any team' }, { status: 403 });
    }
    // --- End session and team IDs ---

    // Find the article first to verify ownership/team membership
    const articleToDelete = await prisma.article.findFirst({
      where: {
        id: articleId,
        teamId: {
          in: userTeamIds, // Ensure the article belongs to one of the user's teams
        },
      },
      select: { id: true }, // Only need to select 'id' to confirm existence and access rights
    });

    if (!articleToDelete) {
      // If article not found OR doesn't belong to user's teams, return 404
      console.log(`Article ${articleId} not found or user ${userId} lacks permission to delete.`);
      return NextResponse.json({ error: 'Article not found or access denied' }, { status: 404 });
    }

    // If the article exists and belongs to the user's team, proceed with deletion
    await prisma.article.delete({
      where: { id: articleId },
    });

    console.log(`Article ${articleId} deleted successfully by user ${userId}.`);
    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 }); // Use 200 OK or 204 No Content

  } catch (error: any) {
    console.error(`Error deleting article ${articleId}:`, error);
    // Handle potential Prisma errors, e.g., record not found after check (rare race condition)
    if (error.code === 'P2025') {
         return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete article', details: error.message }, { status: 500 });
  }
}

// Placeholder for future GET by ID or PUT/PATCH if needed in this file
// export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) { ... }
// export async function PUT(req: NextRequest, { params }: { params: { articleId: string } }) { ... } 