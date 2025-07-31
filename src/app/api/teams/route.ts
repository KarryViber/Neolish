import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Role } from '@prisma/client';

// Validation schema for creating a team
const createTeamSchema = z.object({
  name: z.string().min(1, { message: 'Team name cannot be empty' }).max(100, { message: 'Team name too long' }),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const memberships = await prisma.membership.findMany({
      where: {
        userId: userId,
      },
      include: {
        team: {
          include: {
            _count: {
              select: {
                memberships: true,
              },
            },
          },
        },
      },
      orderBy: {
        team: {
          createdAt: 'desc', // Order by team creation date (newest first)
        }
      }
    });

    // Extract teams and their roles from memberships
    const teamsWithRoles = memberships.map(m => ({ 
      ...m.team, 
      role: m.role,
      memberCount: m.team._count.memberships,
    }));

    return NextResponse.json(teamsWithRoles, { status: 200 });

  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const validatedData = createTeamSchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedData.error.errors }, { status: 400 });
    }

    const { name } = validatedData.data;
    const userId = session.user.id;

    // Use a transaction to ensure both team and membership are created successfully
    const newTeam = await prisma.$transaction(async (tx) => {
      const createdTeam = await tx.team.create({
        data: {
          name: name,
          ownerId: userId, // Added ownerId
        },
      });

      await tx.membership.create({
        data: {
          userId: userId,
          teamId: createdTeam.id,
          role: Role.OWNER, // Assign OWNER role
        },
      });

      return createdTeam;
    });

    return NextResponse.json(newTeam, { status: 201 }); // 201 Created status

  } catch (error) {
    console.error("Error creating team:", error);
    // Basic error handling, consider more specific checks
    if (error instanceof z.ZodError) {
       return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
} 