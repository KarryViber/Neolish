import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // 假设你使用 Prisma
import { getServerSession } from 'next-auth/next'; // 假设你使用 NextAuth
import { authOptions } from '@/lib/authOptions'; // Updated import path

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // You might want to add logic here to verify if the user has permission
    // to update this specific article (e.g., is the author or an admin).

    const body = await request.json();
    const newStatus = body.status;

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    if (!newStatus) {
      return NextResponse.json({ error: 'New status is required in the request body' }, { status: 400 });
    }

    // Add your validation for 'newStatus' here if needed
    // e.g., ensure it's one of the allowed status values
    const allowedStatuses = ['draft', 'pending_publish', 'published', 'archived']; // Example
    if (!allowedStatuses.includes(newStatus)) {
        return NextResponse.json({ error: `Invalid status value. Allowed statuses are: ${allowedStatuses.join(', ')}` }, { status: 400 });
    }

    console.log(`Attempting to update status for article ${articleId} to ${newStatus} by user ${session.user.id}`);

    // --- BEGIN DATABASE INTERACTION --- //
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { status: newStatus }, // Ensure your Article model has a 'status' field of appropriate type
    });
    // --- END DATABASE INTERACTION --- //
    
    console.log(`Successfully updated status for article ${articleId} to ${newStatus}`);
    return NextResponse.json({
      message: 'Article status updated successfully',
      article: updatedArticle, // Return the actual updated article from the database
    });

  } catch (error: any) {
    const { articleId } = await params;
    console.error(`Error updating status for article ${articleId}:`, error);
    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (error instanceof SyntaxError && error.message.includes('JSON')) { // Check if it's a JSON parsing error
        return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
    }
    // Handle Prisma specific error for "Record to update/delete does not exist"
    if (error.code === 'P2025') { 
      return NextResponse.json({ error: 'Article not found with the provided ID.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'An unknown error occurred while updating article status.' }, { status: 500 });
  }
} 