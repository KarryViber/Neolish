import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma'; 
import { z } from 'zod';

// Define the Zod schema for merchandise creation, now including teamId
const merchandiseSchema = z.object({
  name: z.string().min(1, 'Merchandise Name is required'),
  summary: z.string().optional(),
  source: z.string().optional(),
  sourceType: z.enum(['url', 'file', 'manual']),
  tags: z.array(z.string()).optional(),
  teamId: z.string().min(1, 'Team ID is required'), 
});

// GET /api/merchandise - Fetch merchandise for the current team
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id || !session.user?.activeTeamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const activeTeamId = session.user.activeTeamId;

    const url = new URL(request.url);
    let teamIdForQuery = url.searchParams.get('teamId');

    if (!teamIdForQuery) {
      if (session.user.teams && session.user.teams.length > 0) {
        teamIdForQuery = session.user.teams[0].id;
      } else {
        return NextResponse.json({ error: 'Team context is required to fetch merchandise or no teams found for user.' }, { status: 400 });
      }
    }

    if (!teamIdForQuery) {
        return NextResponse.json({ error: 'Team ID is required to fetch merchandise.' }, { status: 400 });
    }

    const merchandiseItems = await prisma.merchandise.findMany({
      where: {
        teamId: teamIdForQuery, 
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: { 
        user: { 
          select: { username: true, id: true },
        },
        team: {
          select: { name: true, id: true },
        },
        // tags: true, // Commented out to avoid potential unknown field error
        // outlines: true // Commented out to avoid potential unknown field error
      },
    });
    return NextResponse.json(merchandiseItems);
  } catch (error) {
    console.error("Error fetching merchandise:", error);
    return NextResponse.json({ error: 'Failed to fetch merchandise' }, { status: 500 });
  }
}

// POST /api/merchandise - Create new merchandise for a specific team
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id || !session.user?.activeTeamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const activeTeamId = session.user.activeTeamId;
    const userId = session.user.id;

    const body = await request.json();
    const validation = merchandiseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, summary, source, sourceType, tags, teamId } = validation.data;

    const newMerchandise = await prisma.merchandise.create({
      data: {
        name,
        summary: summary || "",
        source: source || "",
        sourceType,
        tags: tags || [],
        teamId: teamId,   
        userId: userId,   
      },
    });

    return NextResponse.json(newMerchandise, { status: 201 });

  } catch (error: any) {
    console.error("Error creating merchandise:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('name') && error.meta?.target?.includes('teamId')) {
      return NextResponse.json({ error: 'Merchandise with this name already exists in your team' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create merchandise' }, { status: 500 });
  }
}