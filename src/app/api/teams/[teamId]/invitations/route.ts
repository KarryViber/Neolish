import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Role, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';

const generateActivationCodeSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

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

    // 1. Check permission (OWNER or ADMIN)
    const membership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: userId, teamId: teamId } },
    });
    if (!membership || (membership.role !== Role.OWNER && membership.role !== Role.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view activation codes for this team.' }, { status: 403 });
    }

    // 2. Fetch all unused activation codes for this team
    const invitations = await prisma.activationCode.findMany({
      where: {
        teamId: teamId,
        isUsed: false,
      },
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
      select: {
        id: true,
        code: true,
        email: true,
        createdAt: true,
        isUsed: true,
      },
    });

    return NextResponse.json(invitations, { status: 200 });

  } catch (error) {
    console.error("Error fetching activation codes:", error);
    return NextResponse.json({ error: 'Failed to fetch activation codes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const json = await req.json();
    const validatedData = generateActivationCodeSchema.safeParse(json);

    if (!validatedData.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedData.error.errors }, { status: 400 });
    }
    const { email } = validatedData.data;

    // 1. Check permission (OWNER or ADMIN)
    const membership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: userId, teamId: teamId } },
    });
    if (!membership || (membership.role !== Role.OWNER && membership.role !== Role.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to generate activation codes for this team.' }, { status: 403 });
    }

    // 2. Check if email already belongs to a member
    const existingUserAsMember = await prisma.user.findUnique({
      where: { email: email },
      include: { memberships: { where: { teamId: teamId } } },
    });
    if (existingUserAsMember && existingUserAsMember.memberships.length > 0) {
      return NextResponse.json({ error: 'This user is already a member of the team.' }, { status: 409 });
    }

    // 3. Check for existing *unused* ActivationCode for this email and team
    const existingUnusedCode = await prisma.activationCode.findFirst({
      where: {
        teamId: teamId,
        email: email,
        isUsed: false,
      },
    });

    if (existingUnusedCode) {
      return NextResponse.json(existingUnusedCode, { status: 200 });
    }

    // 4. Generate a unique activation code
    const code = nanoid(8).toUpperCase();

    // 5. Create the ActivationCode record
    const newActivationCode = await prisma.activationCode.create({
      data: {
        code: code,
        teamId: teamId,
        email: email,
      },
    });

    return NextResponse.json(newActivationCode, { status: 201 });

  } catch (error) {
    console.error("Error generating activation code:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Failed to generate a unique code or code already exists, please try again.' }, { status: 500 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to generate activation code' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ teamId: string }> }) {
  try {
    const { teamId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const url = new URL(req.url);
    const invitationId = url.searchParams.get('id');

    if (!invitationId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    // 1. Check permission (OWNER or ADMIN)
    const membership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: userId, teamId: teamId } },
    });
    if (!membership || (membership.role !== Role.OWNER && membership.role !== Role.ADMIN)) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to revoke activation codes for this team.' }, { status: 403 });
    }

    // 2. Find and verify the invitation belongs to this team and is unused
    const invitation = await prisma.activationCode.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    if (invitation.teamId !== teamId) {
      return NextResponse.json({ error: 'Invitation does not belong to this team' }, { status: 403 });
    }

    if (invitation.isUsed) {
      return NextResponse.json({ error: 'Cannot revoke an already used invitation' }, { status: 400 });
    }

    // 3. Delete the invitation
    await prisma.activationCode.delete({
      where: { id: invitationId },
    });

    return NextResponse.json({ message: 'Invitation revoked successfully' }, { status: 200 });

  } catch (error) {
    console.error("Error revoking activation code:", error);
    return NextResponse.json({ error: 'Failed to revoke activation code' }, { status: 500 });
  }
} 