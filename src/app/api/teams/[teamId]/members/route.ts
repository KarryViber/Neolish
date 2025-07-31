import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

interface RouteParams {
  params: {
    teamId: string;
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Verify the requesting user is a member of the team
    const requestingMembership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: userId, teamId: teamId } },
    });

    if (!requestingMembership) {
      return NextResponse.json({ error: 'Forbidden: You are not a member of this team.' }, { status: 403 });
    }

    // 2. Fetch all memberships for the team, including related user data
    const members = await prisma.membership.findMany({
      where: { teamId: teamId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
            createdAt: true, // User registration date
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Order by when they joined the team
      },
    });

    // 3. Format the response (optional, but good practice)
    const formattedMembers = members.map(m => ({
      userId: m.user.id,
      email: m.user.email,
      username: m.user.username,
      avatar: m.user.avatar,
      role: m.role,
      joinedAt: m.createdAt, // When the membership was created
      userRegisteredAt: m.user.createdAt, // When the user originally registered
    }));

    return NextResponse.json(formattedMembers, { status: 200 });

  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

// PATCH method to update member role
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requesterId = session.user.id;
    const { targetUserId, newRole } = await req.json();

    // Validate input
    if (!targetUserId || !newRole) {
      return NextResponse.json({ error: 'Target user ID and new role are required' }, { status: 400 });
    }

    if (!Object.values(Role).includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if requester is an OWNER or ADMIN of the team
    const requesterMembership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: requesterId, teamId: teamId } },
    });

    if (!requesterMembership || (requesterMembership.role !== 'OWNER' && requesterMembership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden: Only team owners and admins can update member roles' }, { status: 403 });
    }

    // Get target member's current membership
    const targetMembership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: targetUserId, teamId: teamId } },
    });

    if (!targetMembership) {
      return NextResponse.json({ error: 'Target user is not a member of this team' }, { status: 404 });
    }

    // Additional business rules:
    // 1. Can't change your own role
    if (requesterId === targetUserId) {
      return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 });
    }

    // 2. Only OWNER can promote to OWNER or demote from OWNER
    if (newRole === 'OWNER' || targetMembership.role === 'OWNER') {
      if (requesterMembership.role !== 'OWNER') {
        return NextResponse.json({ error: 'Only team owners can change OWNER role' }, { status: 403 });
      }
    }

    // 3. Ensure at least one OWNER exists
    if (targetMembership.role === 'OWNER' && newRole !== 'OWNER') {
      const ownerCount = await prisma.membership.count({
        where: { teamId: teamId, role: 'OWNER' },
      });
      
      if (ownerCount <= 1) {
        return NextResponse.json({ error: 'Cannot remove the last owner from the team' }, { status: 400 });
      }
    }

    // Update the role
    const updatedMembership = await prisma.membership.update({
      where: { userId_teamId: { userId: targetUserId, teamId: teamId } },
      data: { role: newRole },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      userId: updatedMembership.user.id,
      email: updatedMembership.user.email,
      username: updatedMembership.user.username,
      avatar: updatedMembership.user.avatar,
      role: updatedMembership.role,
      joinedAt: updatedMembership.createdAt,
      userRegisteredAt: updatedMembership.user.createdAt,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json({ error: 'Failed to update member role' }, { status: 500 });
  }
}

// DELETE method to remove member
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requesterId = session.user.id;
    const { targetUserId } = await req.json();

    // Validate input
    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    // Check if requester is an OWNER or ADMIN of the team
    const requesterMembership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: requesterId, teamId: teamId } },
    });

    if (!requesterMembership || (requesterMembership.role !== 'OWNER' && requesterMembership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden: Only team owners and admins can remove members' }, { status: 403 });
    }

    // Get target member's current membership
    const targetMembership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: targetUserId, teamId: teamId } },
    });

    if (!targetMembership) {
      return NextResponse.json({ error: 'Target user is not a member of this team' }, { status: 404 });
    }

    // Business rules:
    // 1. Can't remove yourself
    if (requesterId === targetUserId) {
      return NextResponse.json({ error: 'You cannot remove yourself from the team' }, { status: 400 });
    }

    // 2. Only OWNER can remove other OWNERs
    if (targetMembership.role === 'OWNER' && requesterMembership.role !== 'OWNER') {
      return NextResponse.json({ error: 'Only team owners can remove other owners' }, { status: 403 });
    }

    // 3. Ensure at least one OWNER exists
    if (targetMembership.role === 'OWNER') {
      const ownerCount = await prisma.membership.count({
        where: { teamId: teamId, role: 'OWNER' },
      });
      
      if (ownerCount <= 1) {
        return NextResponse.json({ error: 'Cannot remove the last owner from the team' }, { status: 400 });
      }
    }

    // Remove the membership
    await prisma.membership.delete({
      where: { userId_teamId: { userId: targetUserId, teamId: teamId } },
    });

    return NextResponse.json({ message: 'Member removed successfully' }, { status: 200 });

  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
} 