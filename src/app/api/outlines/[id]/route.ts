import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// DELETE handler to delete an outline by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: outlineId } = await params;
  if (!outlineId) {
    return NextResponse.json({ message: 'Outline ID not provided' }, { status: 400 });
  }

  try {
    // Optional: Check if the outline is associated with any articles before deleting
    // For now, we will proceed with direct deletion. If cascading delete is set up
    // in Prisma schema for related articles, they might be handled automatically or prevent deletion.

    await prisma.outline.delete({
      where: { id: outlineId },
    });
    
    return NextResponse.json({ message: 'Outline deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting outline ${outlineId}:`, error);
    if (error.code === 'P2025') {
      // Record to delete not found
      return NextResponse.json({ message: 'Outline not found for deletion' }, { status: 404 });
    }
    // Handle other potential errors, e.g., foreign key constraint if articles are linked and no cascade delete
    // if (error.code === 'P2003') { // Foreign key constraint failed on the field: `delete()`
    //   return NextResponse.json({ message: 'Cannot delete outline as it is linked to existing articles.', error: error.message }, { status: 409 });
    // }
    return NextResponse.json(
      { message: `Failed to delete outline ${outlineId}`, error: error.message },
      { status: 500 }
    );
  }
}

// Schema for validating the update request body
const outlineUpdateSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }).optional(),
  content: z.string().optional(),
  styleProfileId: z.string().cuid({ message: "Invalid Style Profile ID"}).optional(),
  userKeyPoints: z.string().optional(),
  merchandiseId: z.string().cuid({ message: "Invalid Merchandise ID"}).optional().nullable(),
});

// PUT handler to update an existing outline
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: outlineId } = await params;
  
  if (!outlineId) {
    return NextResponse.json({ message: 'Outline ID not provided' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validatedData = outlineUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const dataToUpdate: { title?: string; content?: string; styleProfileId?: string; userKeyPoints?: string; merchandiseId?: string | null } = {};
    if (validatedData.data.title !== undefined) {
      dataToUpdate.title = validatedData.data.title;
    }
    if (validatedData.data.content !== undefined) {
      dataToUpdate.content = validatedData.data.content;
    }
    if (validatedData.data.styleProfileId !== undefined) {
      dataToUpdate.styleProfileId = validatedData.data.styleProfileId;
    }
    if (validatedData.data.userKeyPoints !== undefined) {
      dataToUpdate.userKeyPoints = validatedData.data.userKeyPoints;
    }
    if (validatedData.data.merchandiseId !== undefined) {
      dataToUpdate.merchandiseId = validatedData.data.merchandiseId;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json({ message: 'No fields provided for update' }, { status: 400 });
    }
    
    const updatedOutline = await prisma.outline.update({
      where: { id: outlineId },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: 'Outline updated successfully', outline: updatedOutline }, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating outline ${outlineId}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Outline not found for update' }, { status: 404 });
    }
    return NextResponse.json(
      { message: `Failed to update outline ${outlineId}`, error: error.message },
      { status: 500 }
    );
  }
}

// We can add PUT handler here later if we need to update outlines (e.g., title, or regenerate)
// export async function PUT(request: Request, { params }: { params: { id: string } }) { ... } 