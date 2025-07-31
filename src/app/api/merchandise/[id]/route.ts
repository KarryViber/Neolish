import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client'; // Import Prisma for potential specific types
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions'; // Updated import path
import { z } from 'zod';

const prisma = new PrismaClient();

// Zod schema for validating PUT request body (similar to POST, but all fields optional for partial updates)
const updateMerchandiseSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }).optional(),
  summary: z.string().optional(),
  source: z.string().min(1, { message: "Source cannot be empty" }).optional(),
  sourceType: z.enum(['url', 'file', 'manual']).optional(),
  tags: z.array(z.string()).optional(),
});

// Helper function to get teamId and validate session
async function getSessionAndTeamId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), teamId: null, userId: null };
  }
  const userTeams = session.user.teams;
  if (!userTeams || userTeams.length === 0) {
    return { error: NextResponse.json({ error: 'User is not part of any team' }, { status: 403 }), teamId: null, userId: session.user.id };
  }
  return { error: null, teamId: userTeams[0].id, userId: session.user.id };
}

// GET /api/merchandise/[id] - Get a specific merchandise item
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: merchandiseId } = await params;
  try {
    const { error, teamId } = await getSessionAndTeamId();
    if (error) return error;

    const merchandise = await prisma.merchandise.findUnique({
      where: {
        id: merchandiseId,
        teamId: teamId!, // teamId is guaranteed to be non-null if error is null
      },
    });

    if (!merchandise) {
      return NextResponse.json({ error: 'Merchandise not found or access denied' }, { status: 404 });
    }
    return NextResponse.json(merchandise);

  } catch (e) {
    console.error(`Error fetching merchandise ${merchandiseId}:`, e);
    return NextResponse.json({ error: 'Failed to fetch merchandise' }, { status: 500 });
  }
}

// PUT /api/merchandise/[id] - Update a specific merchandise item
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: merchandiseId } = await params;
  try {
    const { error, teamId } = await getSessionAndTeamId();
    if (error) return error;

    const body = await request.json();
    const validation = updateMerchandiseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Check if the merchandise item exists and belongs to the team before updating
    const existingMerchandise = await prisma.merchandise.findUnique({
      where: {
        id: merchandiseId,
        teamId: teamId!,
      },
    });

    if (!existingMerchandise) {
      return NextResponse.json({ error: 'Merchandise not found or access denied' }, { status: 404 });
    }

    const updatedMerchandise = await prisma.merchandise.update({
      where: {
        id: merchandiseId,
        // No need to specify teamId here again as we already verified ownership
      },
      data: validation.data, // Pass validated data directly for partial updates
    });

    return NextResponse.json(updatedMerchandise);

  } catch (e: any) {
    console.error(`Error updating merchandise ${merchandiseId}:`, e);
    if (e.code === 'P2002' && e.meta?.target?.includes('name') && e.meta?.target?.includes('teamId')) {
      return NextResponse.json({ error: 'Another merchandise item with this name already exists in your team' }, { status: 409 });
    }
    if (e.code === 'P2025') { // Record to update not found
        return NextResponse.json({ error: 'Merchandise not found for update' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update merchandise' }, { status: 500 });
  }
}

// DELETE /api/merchandise/[id] - Delete a specific merchandise item
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: merchandiseId } = await params;
  try {
    const { error, teamId } = await getSessionAndTeamId();
    if (error) return error;

    // Check if the merchandise item exists and belongs to the team before deleting
    const existingMerchandise = await prisma.merchandise.findUnique({
        where: {
            id: merchandiseId,
            teamId: teamId!,
        },
    });

    if (!existingMerchandise) {
        return NextResponse.json({ error: 'Merchandise not found or access denied' }, { status: 404 });
    }

    await prisma.merchandise.delete({
      where: {
        id: merchandiseId,
        // No need to specify teamId again as we already verified ownership
      },
    });

    return new NextResponse(null, { status: 204 }); // 204 No Content for successful deletion

  } catch (e: any) {
    console.error(`Error deleting merchandise ${merchandiseId}:`, e);
    if (e.code === 'P2025') { // Record to delete not found
        return NextResponse.json({ error: 'Merchandise not found for deletion' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete merchandise' }, { status: 500 });
  }
} 