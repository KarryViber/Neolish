import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Import the Prisma client instance
import { z } from 'zod'; // Using Zod for input validation
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '@/lib/authOptions'; // Updated import path

// GET handler to fetch all style profiles
export async function GET(request: NextRequest) {
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
      // If user is not part of any team, return empty list
      return NextResponse.json([]);
    }
    // --- End session and team IDs ---

    // Get searchTerm from query parameters
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('searchTerm');

    // Base where clause for team filtering
    const whereClause: Prisma.StyleProfileWhereInput = {
        teamId: {
          in: userTeamIds,
        }
    };

    // If searchTerm is provided, add name filtering
    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const styleProfiles = await prisma.styleProfile.findMany({
      where: whereClause, // Use the constructed whereClause
      orderBy: {
        createdAt: 'desc', // Order by creation date, newest first
      },
      include: {
        user: {
          select: {
            username: true,
          }
        }
      }
    });
    return NextResponse.json(styleProfiles);
  } catch (error) {
    console.error("Error fetching style profiles:", error);
    return NextResponse.json({ error: 'Failed to fetch style profiles' }, { status: 500 });
  }
}

// This is the correct and more detailed Zod schema for POST requests
const styleProfileCreatePostSchema = z.object({
  name: z.string().min(1, { message: '画像名称 (name) 是必填项' }),
  description: z.string().optional().nullable(),
  authorInfo: z.object({ manual_input: z.string() }).optional().nullable(),
  styleFeatures: z.object({ manual_input: z.string() }).optional().nullable(),
  sampleText: z.string().optional().nullable(),
  teamId: z.string().min(1, { message: "Team ID is required" }),
});

// 推断出 TypeScript 类型以供使用
// type StyleProfileCreateRequestBody = z.infer<typeof styleProfileCreatePostSchema>; // Renamed schema for clarity

// POST handler to create a new style profile (manual creation)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized: User session not found or user ID is missing.' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    // console.log("[POST /api/style-profiles] Received body:", JSON.stringify(body, null, 2)); // Optional: log received body
    const validatedData = styleProfileCreatePostSchema.safeParse(body);

    if (!validatedData.success) {
      // console.error("[POST /api/style-profiles] Zod validation failed:", validatedData.error.flatten().fieldErrors); // Optional: log Zod errors
      return NextResponse.json(
        { message: 'Input data validation failed', errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, description, authorInfo, styleFeatures, sampleText, teamId } = validatedData.data;

    // Initialize dataToCreate for Prisma, ensuring correct types
    const dataToCreate: {
      name: string;
      teamId: string;
      userId: string;
      description?: string | null;
      authorInfo?: string | null;    // Prisma expects String or Null
      styleFeatures?: string | null; // Prisma expects String or Null
      sampleText?: string | null;
    } = { name, teamId, userId };

    if (description !== undefined) dataToCreate.description = description; 
    
    // Convert authorInfo from { manual_input: string } | null to string | null for Prisma
    if (authorInfo !== undefined && authorInfo !== null) {
      dataToCreate.authorInfo = authorInfo.manual_input;
    } else if (authorInfo === null) {
      dataToCreate.authorInfo = null;
    }

    // Convert styleFeatures from { manual_input: string } | null to string | null for Prisma
    if (styleFeatures !== undefined && styleFeatures !== null) {
      dataToCreate.styleFeatures = styleFeatures.manual_input;
    } else if (styleFeatures === null) {
      dataToCreate.styleFeatures = null;
    }
    
    if (sampleText !== undefined) dataToCreate.sampleText = sampleText; 

    // console.log("[POST /api/style-profiles] Data for Prisma:", JSON.stringify(dataToCreate, null, 2)); // Optional: log data before Prisma create

    const newProfile = await prisma.styleProfile.create({
      data: dataToCreate,
    });

    console.log(`StyleProfile created: ${newProfile.id} for team ${teamId}`);
    return NextResponse.json(newProfile, { status: 201 });

  } catch (error: any) {
    console.error("Error creating style profile:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            // For the composite key @@unique([name, teamId]), error.meta.target will be ['name', 'teamId']
            const errorMessage = `A style profile with this name already exists in your team. Please use a different name.`;
            // The existing checks for error.meta.target are fine, as they confirm 'name' is part of the conflict.
            // No need to change those conditions, just the message itself.
            return NextResponse.json({ message: errorMessage }, { status: 409 });
        }
    }
    return NextResponse.json({ message: 'Failed to create style profile', error: error.message }, { status: 500 });
  }
} 