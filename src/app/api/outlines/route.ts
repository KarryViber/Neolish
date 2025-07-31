import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Corrected import
import { Prisma } from '@prisma/client'; // Keep for Prisma.JsonValue if used elsewhere, but not for outline.content
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '@/lib/authOptions'; // Updated import path

// Define the structure expected by the frontend (from outlines/page.tsx - OutlineWithDetails)
// interface OutlineFromAPI { // This interface is no longer fully accurate, OutlineWithDetails is the target
//   id: string;
//   title: string; 
//   styleProfileId: string; //
//   styleProfileName: string; 
//   recommendedAudiences: string[]; // This structure will change
// }

// Define the structure for an audience within an outline, matching frontend's AudienceInOutline
interface ApiAudienceInOutline {
  id: string;
  name: string;
  description: string | null;
  tags: string[]; // Prisma stores tags as Json, Prisma.JsonValue -> string[]
  type: string | null; // Changed from AudienceType to string | null
}

interface ApiOutlineAudienceLink {
  audience: ApiAudienceInOutline;
}

interface ApiOutlineWithDetails {
  id: string;
  title: string;
  content: string | null; // Corresponds to outline.content (String) in DB, not Prisma.JsonValue
  userKeyPoints: string | null;
  styleProfileId: string;
  styleProfile: { id: string; name: string } | null; // Added id to styleProfile for consistency if needed
  outlineAudiences: ApiOutlineAudienceLink[];
  updatedAt: Date;
  createdAt: Date; // Added createdAt for potential use
  merchandiseId: string | null; // Added merchandiseId
  merchandise: { id: string; name: string; tags: string[] } | null; // Added merchandise details with tags
  user?: { username: string }; // Added user with username
  // Add any other fields from PrismaOutline that are directly used if needed e.g. createdAt, status
}


export async function GET(request: NextRequest) {
  console.log("GET /api/outlines called with filters (fuzzy tag search)");
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
      return NextResponse.json([]); // Return empty array as per original structure for no data
    }
    // --- End session and team IDs ---

    const url = new URL(request.url);
    const title = url.searchParams.get('title');
    const styleProfileId = url.searchParams.get('styleProfileId');
    const audienceTag = url.searchParams.get('audienceTag');

    const whereClause: Prisma.OutlineWhereInput = {
        teamId: {
          in: userTeamIds,
      },
    };

    if (title) {
      whereClause.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (styleProfileId) {
      whereClause.styleProfileId = styleProfileId;
    }

    if (audienceTag) {
      const allTeamAudiences = await prisma.audience.findMany({
        where: {
          teamId: { in: userTeamIds },
        },
        select: { id: true, tags: true }, // Select tags for fuzzy matching
      });

      const matchingAudienceIds: string[] = [];
      const lowercasedAudienceTag = audienceTag.toLowerCase();

      for (const audience of allTeamAudiences) {
        // Ensure audience.tags is an array of strings before trying to iterate
        const tagsArray = Array.isArray(audience.tags) 
          ? audience.tags.filter(tag => typeof tag === 'string') 
          : [];

        for (const tag of tagsArray) {
          if (tag.toLowerCase().includes(lowercasedAudienceTag)) {
            matchingAudienceIds.push(audience.id);
            break; // Found a match for this audience, move to the next audience
          }
        }
      }

      if (matchingAudienceIds.length > 0) {
        whereClause.outlineAudiences = {
          some: {
            audienceId: {
              in: matchingAudienceIds,
            },
          },
        };
      } else {
        // If audienceTag is specified but no audiences match, then no outlines can match this criteria.
        // Return an empty array directly.
        console.log("Audience tag (fuzzy: '" + audienceTag + "') specified but no matching audiences found, returning empty list.");
        return NextResponse.json([]);
      }
    }

    const outlinesFromDb = await prisma.outline.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        styleProfile: { 
          select: {
            id: true, 
            name: true,
          },
        },
        outlineAudiences: { 
          include: {
            audience: { 
              select: {
                id: true,
                name: true,
                description: true,
                tags: true, 
                type: true,
              },
            },
          },
        },
        merchandise: {
          select: {
            id: true,
            name: true,
            tags: true, // <-- 增加 tags
          }
        },
        user: { // Include user information
          select: {
            username: true,
          }
        }
      },
    });

    // Map the data to the structure expected by the frontend
    const outlinesForApi: ApiOutlineWithDetails[] = outlinesFromDb.map((outline) => ({
      id: outline.id,
      title: outline.title,
      content: outline.content, 
      userKeyPoints: outline.userKeyPoints,
      styleProfileId: outline.styleProfileId, 
      styleProfile: outline.styleProfile ? { id: outline.styleProfile.id, name: outline.styleProfile.name } : null,
      outlineAudiences: outline.outlineAudiences.map((oa: any) => ({
        audience: {
          id: oa.audience.id,
          name: oa.audience.name,
          description: oa.audience.description,
          tags: (Array.isArray(oa.audience.tags) ? oa.audience.tags.filter((tag: any) => typeof tag === 'string') : []) as string[],
          type: oa.audience.type, 
        },
      })),
      updatedAt: outline.updatedAt,
      createdAt: outline.createdAt,
      merchandiseId: outline.merchandiseId, 
      merchandise: outline.merchandise ? { 
        id: outline.merchandise.id, 
        name: outline.merchandise.name,
        tags: (Array.isArray(outline.merchandise.tags) ? outline.merchandise.tags.filter(tag => typeof tag === 'string') : []) as string[] // <-- 确保 tags 被包含和正确处理
      } : null, 
      user: outline.user ? { username: outline.user.username } : undefined, // Add user to mapped object
    }));

    console.log(`Returning ${outlinesForApi.length} outlines based on filters (fuzzy tag search enabled).`);
    return NextResponse.json(outlinesForApi);

  } catch (error) {
    console.error('Error fetching outlines with fuzzy tag search filters:', error);
    // It's good practice to avoid sending raw error messages to the client in production
    const errorMessage = 'Internal server error: Failed to fetch outlines';
    if (error instanceof Error) {
        // You might want to log error.message or error.stack on the server
        // but not necessarily send it to the client.
        // For development, error.message can be helpful.
        // errorMessage = error.message; // Be cautious with this in production
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST handler for generating outlines is in a separate file: ./generate/route.ts
// We will add other handlers like DELETE by ID in a dynamic route file: /[id]/route.ts 