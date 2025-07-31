import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { validatePasswordStrength } from '@/utils/passwordStrength';

// GET method to fetch current user profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// PATCH method to update user profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, email, currentPassword, newPassword } = await req.json();

    // Validate input
    if (!username && !email && !newPassword) {
      return NextResponse.json({ error: 'At least one field must be provided for update' }, { status: 400 });
    }

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    // Update username if provided
    if (username && username !== currentUser.username) {
      // Check if username is already taken
      const existingUser = await prisma.user.findFirst({
        where: { 
          username: username,
          id: { not: session.user.id }
        },
      });
      
      if (existingUser) {
        return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
      }
      
      updateData.username = username;
    }

    // Update email if provided
    if (email && email !== currentUser.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: email,
          id: { not: session.user.id }
        },
      });
      
      if (existingUser) {
        return NextResponse.json({ error: 'Email is already taken' }, { status: 400 });
      }
      
      updateData.email = email;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to change password' }, { status: 400 });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.passwordHash);
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      // Validate new password strength
      const passwordStrength = validatePasswordStrength(newPassword);
      if (!passwordStrength.isValid) {
        return NextResponse.json({ 
          error: 'Password does not meet security requirements', 
          details: passwordStrength.feedbackKeys 
        }, { status: 400 });
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
      updateData.passwordHash = newPasswordHash;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
} 