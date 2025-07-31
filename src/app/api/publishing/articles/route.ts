import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Updated import path
import { prisma } from "@/lib/prisma"; // Changed to named import based on linter error

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized: User not logged in or session invalid." }, { status: 401 });
    }
    const userId = session.user.id;

    // Get the user's teamId. 
    // This logic might need adjustment based on how you manage multiple teams or a primary team.
    // For now, we'll take the first team membership found for the user.
    const membership = await prisma.membership.findFirst({
      where: {
        userId: userId,
      },
      select: {
        teamId: true,
      },
    });

    if (!membership?.teamId) {
      // If the user is not part of any team, or no team ID could be determined.
      // Returning an empty array is often a good default for list endpoints.
      console.log(`No team found for user ${userId}. Returning empty list for publishing.`);
      return NextResponse.json([], { status: 200 });
    }
    const userTeamId = membership.teamId;
    console.log(`Fetching articles for publishing for user ${userId}, team ${userTeamId}`);

    const articles = await prisma.article.findMany({
      where: {
        teamId: userTeamId,
        status: {
          in: ['pending_publish', 'published', 'PUBLISHED', 'Pending_publish'],
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        user: {
          select: {
            username: true,
          },
        },
        // Add any other fields needed for the list view
        // e.g., author (if relevant and available), summary (if available)
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log(`Found ${articles.length} articles for user ${userId}, team ${userTeamId}`);
    
    // Normalize status values to lowercase standard format
    const normalizedArticles = articles.map(article => ({
      ...article,
      status: article.status.toLowerCase() === 'published' || article.status === 'PUBLISHED' 
        ? 'published' 
        : 'pending_publish' // Always use underscore format for pending_publish
    }));
    
    return NextResponse.json(normalizedArticles, { status: 200 });

  } catch (error) {
    console.error("Error fetching articles for publishing:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: "Error fetching articles for publishing.", error: errorMessage }, { status: 500 });
  }
} 