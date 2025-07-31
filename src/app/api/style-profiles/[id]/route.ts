import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// Schema for validating the update request body
const styleProfileUpdateSchema = z.object({
  name: z.string().min(1, { message: 'Profile name cannot be empty' }).optional(),
  description: z.string().nullable().optional(),
  // Allow both direct string (for existing data or non-object inputs) 
  // and the object structure from the form for new/updated manual inputs.
  authorInfo: z.union([
    z.string(),
    z.object({ manual_input: z.string() })
  ]).nullable().optional(),
  styleFeatures: z.union([
    z.string(),
    z.object({ manual_input: z.string() })
  ]).nullable().optional(),
  sampleText: z.string().nullable().optional(),
});

// PUT handler to update an existing style profile
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = await params;
  if (!profileId) {
    return NextResponse.json({ message: 'Style profile ID not provided' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log(`[PUT /api/style-profiles/${profileId}] Received body:`, JSON.stringify(body, null, 2)); // DEBUG

    const validatedData = styleProfileUpdateSchema.safeParse(body);

    if (!validatedData.success) {
      console.error(`[PUT /api/style-profiles/${profileId}] Validation failed:`, validatedData.error.flatten()); // DEBUG
      return NextResponse.json(
        { 
          message: 'Input data validation failed',
          errors: validatedData.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    // Construct data object for Prisma update, only including fields that were actually provided
    const dataToUpdate: Record<string, any> = {}; // Using Record for flexibility
    if (validatedData.data.name !== undefined) dataToUpdate.name = validatedData.data.name;
    if (validatedData.data.description !== undefined) dataToUpdate.description = validatedData.data.description;
    
    // Transform authorInfo before adding to dataToUpdate
    if (validatedData.data.authorInfo !== undefined) {
      if (validatedData.data.authorInfo && typeof validatedData.data.authorInfo === 'object' && 'manual_input' in validatedData.data.authorInfo) {
        dataToUpdate.authorInfo = validatedData.data.authorInfo.manual_input;
      } else {
        dataToUpdate.authorInfo = validatedData.data.authorInfo; // Handles string or null
      }
    }

    // Transform styleFeatures before adding to dataToUpdate
    if (validatedData.data.styleFeatures !== undefined) {
      if (validatedData.data.styleFeatures && typeof validatedData.data.styleFeatures === 'object' && 'manual_input' in validatedData.data.styleFeatures) {
        dataToUpdate.styleFeatures = validatedData.data.styleFeatures.manual_input;
      } else {
        dataToUpdate.styleFeatures = validatedData.data.styleFeatures; // Handles string or null
      }
    }

    if (validatedData.data.sampleText !== undefined) dataToUpdate.sampleText = validatedData.data.sampleText;

    if (Object.keys(dataToUpdate).length === 0) {
        return NextResponse.json({ message: 'No fields provided for update' }, { status: 400 });
    }

    console.log(`[PUT /api/style-profiles/${profileId}] Data for Prisma update:`, JSON.stringify(dataToUpdate, null, 2)); // DEBUG
    
    const updatedProfile = await prisma.styleProfile.update({
      where: { id: profileId },
      data: dataToUpdate, // Prisma expects fields to match schema (String? for authorInfo/styleFeatures)
    });

    return NextResponse.json(updatedProfile, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating style profile ${profileId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: `A style profile with this name already exists.` }, { status: 409 });
    }
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Style profile to update not found' }, { status: 404 });
    }
    // Translate common error messages if needed
    const message = error.message?.includes(' ഇൻപുട്ട് ഡാറ്റ മൂല്യനിർണ്ണയം പരാജയപ്പെട്ടു') 
      ? 'Input data validation failed (possibly due to type mismatch after schema change)' 
      : `Failed to update style profile ${profileId}`;
    return NextResponse.json({ message, error: error.message }, { status: 500 });
  }
}

// DELETE handler to delete a style profile by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = await params;
  if (!profileId) {
    return NextResponse.json({ message: 'Style profile ID not provided' }, { status: 400 });
  }

  try {
    await prisma.styleProfile.delete({
      where: { id: profileId },
    });
    return NextResponse.json({ message: 'Style profile deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting style profile ${profileId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: `Style profile with ID ${profileId} not found.` }, { status: 404 });
    }
    return NextResponse.json({ message: `Failed to delete style profile ${profileId}`, error: error.message }, { status: 500 });
  }
}

// TODO: Implement GET handler to fetch a single profile by ID (optional, if needed for edit page directly)
// export async function GET(request: Request, { params }: { params: { id: string } }) { ... }

// TODO: Implement DELETE handler to delete a profile by ID (for future delete functionality)
// export async function DELETE(request: Request, { params }: { params: { id: string } }) { ... } 