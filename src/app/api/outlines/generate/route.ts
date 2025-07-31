import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient, StyleProfile, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from '@/lib/authOptions';

const generateOutlineSchema = z.object({
  styleProfileId: z.string().cuid({ message: 'Please provide a valid style profile ID' }),
  userKeyPoints: z.string().min(1, { message: 'Please enter the key points for the article' }),
  title: z.string().optional(), // 用户可以预设一个标题
  teamId: z.string().min(1, { message: "Team ID is required" }),
  merchandiseId: z.string().cuid({ message: "Invalid Merchandise ID"}).optional().nullable(), // Added merchandiseId
});

// Helper function to construct the style_profile_json string for Dify
const constructStyleProfileJsonForDify = (profile: StyleProfile): string => {
  const relevantData = {
    name: profile.name,
    description: profile.description,
    authorInfo: profile.authorInfo, // Already Json or null
    styleFeatures: profile.styleFeatures, // Already Json or null
    sampleText: profile.sampleText,
  };
  return JSON.stringify(relevantData);
};

// Dify Flow 2 expected output structure (for audience suggestions)
// This will now be an array after parsing the string from Dify
interface ParsedDifyAudienceSuggestion {
  audience_name: string;
  description?: string;
  tags?: string[];
  // Add any other fields that might come from Dify's structured_output for an audience
}

// Define interfaces for Dify's response structure
interface DifyFlowOutputs {
  generated_outline_markdown: string;
  structured_output?: string; // Expecting a JSON string from Dify
  // Add other output keys from Dify if they exist and are used
}

interface DifyResponseData {
  data?: { // Marking data as optional as we check for its existence
    outputs?: DifyFlowOutputs; // Marking outputs as optional
  };
  // Add other top-level fields from Dify if they exist and are relevant
  // e.g., status, error messages at the top level
}

// Helper function to find a unique title for an Outline within a team
async function findUniqueOutlineTitle(baseTitle: string, teamId: string, tx: Prisma.TransactionClient): Promise<string> {
  let uniqueTitle = baseTitle;
  let counter = 1;
  while (true) {
    const existingOutline = await tx.outline.findFirst({
      where: {
        title: uniqueTitle,
        teamId: teamId,
      },
      select: { id: true },
    });

    if (!existingOutline) {
      return uniqueTitle;
    }
    counter++;
    uniqueTitle = `${baseTitle} (${counter})`;
    // Basic length check, similar to findUniqueName
    if (uniqueTitle.length > 255) { 
        const shortBase = baseTitle.substring(0, 240);
        uniqueTitle = `${shortBase} (${counter})`;
        if (uniqueTitle.length > 255) {
            console.warn(`Generated outline title still too long: ${uniqueTitle}. Base: ${baseTitle}`);
            // Fallback or throw error if necessary, for now, returning potentially non-unique if too long
            // or consider a more robust truncation/random suffix strategy
        }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) { 
      return NextResponse.json({ message: 'Unauthorized: User session, ID, or email not found.' }, { status: 401 });
    }
    const userId = session.user.id; 
    const userEmail = session.user.email; 

    const body = await request.json();
    const validation = generateOutlineSchema.safeParse(body);

    if (!validation.success) {
      console.error("Invalid request parameters for outline generation:", validation.error.issues);
      return NextResponse.json({ message: 'Invalid request parameters', errors: validation.error.issues }, { status: 400 });
    }

    const { styleProfileId, userKeyPoints, title: userProvidedTitle, teamId, merchandiseId } = validation.data;

    console.log("[Generate Outline API] Received merchandiseId:", merchandiseId); 

    // 1. Fetch Style Profile from DB
    const styleProfile = await prisma.styleProfile.findUnique({
      where: { id: styleProfileId },
    });

    if (!styleProfile) {
      return NextResponse.json({ message: 'Selected style profile not found' }, { status: 404 });
    }

    // 1b. Fetch Merchandise if ID is provided
    let merchandiseSummary: string | null = null;
    if (merchandiseId) {
      const merchandise = await prisma.merchandise.findUnique({
        where: { id: merchandiseId, teamId: teamId }, 
        select: { summary: true, name: true } 
      });
      console.log("[Generate Outline API] Fetched merchandise:", merchandise); 

      if (merchandise && merchandise.summary && merchandise.summary.trim() !== "") { 
        merchandiseSummary = merchandise.summary;
      } else if (merchandise) {
        console.log(`[Generate Outline API] Merchandise '${merchandise.name}' (ID: ${merchandiseId}) found, but its summary is empty, null, or whitespace.`);
      } else {
        console.warn(`[Generate Outline API] Merchandise with ID ${merchandiseId} not found for team ${teamId}.`);
      }
    }

    // 2. Get Dify credentials from environment variables
    const difyApiEndpoint = process.env.DIFY_API_ENDPOINT;
    const difyFlow2AppToken = process.env.DIFY_FLOW2_APP_TOKEN;
    const difyUserId = userEmail; 

    if (!difyApiEndpoint || !difyFlow2AppToken) { 
      console.error("Dify API Endpoint or Token is not configured in .env.local.");
      return NextResponse.json({ message: 'Dify API configuration is incomplete, please check server logs' }, { status: 500 });
    }

    // 3. Construct Dify Flow 2 input
    const styleProfileJsonString = constructStyleProfileJsonForDify(styleProfile);
    
    const difyInputs: any = {
      user_email: userEmail, // 统一的用户识别参数
      key_points: userKeyPoints,
      style_profile_json: styleProfileJsonString,
    };

    console.log("[Generate Outline API] merchandiseSummary to be used for Dify:", merchandiseSummary); 

    if (merchandiseSummary) { 
      difyInputs.merchandise_summary = merchandiseSummary;
    }

    const difyRequestBody = {
      inputs: difyInputs,
      response_mode: 'blocking', 
      user: difyUserId,
    };

    // 4. Call Dify Flow 2 API
    console.log(`Calling Dify Flow 2 (${difyApiEndpoint}) with token: ${difyFlow2AppToken.substring(0, 10)}...`);
    console.log("[Generate Outline API] Full Dify Request Body before stringify:", JSON.stringify(difyRequestBody, null, 2)); 
    let difyResponseData: DifyResponseData;
    try {
      const difyResponse = await fetch(difyApiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${difyFlow2AppToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(difyRequestBody),
      });

      console.log(`Dify Flow 2 API response status: ${difyResponse.status}`);

      if (!difyResponse.ok) {
        const errorText = await difyResponse.text();
        console.error('Dify Flow 2 API request failed:', errorText);
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch (e) { /* not json */ }
        const errorMessage = errorJson?.message || errorJson?.error?.message || `Dify API error (${difyResponse.status})`;
        return NextResponse.json({ message: errorMessage, details: errorText }, { status: difyResponse.status });
      }
      
      difyResponseData = await difyResponse.json();
      // console.log('Dify Flow 2 API response data:', JSON.stringify(difyResponseData, null, 2));

      // Dify output for workflow usually in data.outputs.<key_name>
      const generatedOutlineMarkdown = difyResponseData?.data?.outputs?.generated_outline_markdown;

      if (typeof generatedOutlineMarkdown !== 'string') {
        console.error('Dify Flow 2 response structure is not as expected or generated_outline_markdown is missing/invalid:', difyResponseData);
        return NextResponse.json({ message: 'Incorrect outline result format from Dify' }, { status: 500 });
      }

      // 5. Process audience suggestions and save new outline within a transaction
      const newOutline = await prisma.$transaction(async (tx) => {
        const createdAudienceIds: string[] = [];
        const rawStructuredOutput = difyResponseData?.data?.outputs?.structured_output;

        if (typeof rawStructuredOutput === 'string' && rawStructuredOutput.trim() !== "") {
          console.log("[Generate Outline API] Raw structured_output string from Dify:", rawStructuredOutput);
          let parsedAudiences: ParsedDifyAudienceSuggestion[] = [];
          try {
            // Remove potential markdown code block fences
            const jsonString = rawStructuredOutput.replace(/^```json\s*|```\s*$/g, '');
            parsedAudiences = JSON.parse(jsonString);
            console.log("[Generate Outline API] Parsed audiences from structured_output:", parsedAudiences);

            if (!Array.isArray(parsedAudiences)) {
              console.warn("[Generate Outline API] structured_output was a string, but did not parse into an array. Parsed as:", parsedAudiences);
              parsedAudiences = []; // Treat as empty if not an array
            }

          } catch (error) {
            console.error("[Generate Outline API] Error parsing structured_output from Dify:", error);
            // Optionally, you could decide to continue without audiences or throw an error
            // For now, we'll proceed without audiences if parsing fails
          }

          for (const suggestion of parsedAudiences) {
            if (suggestion && typeof suggestion === 'object' && suggestion.audience_name) {
              let audience = await tx.audience.findFirst({
                where: {
                  name: suggestion.audience_name,
                  teamId: teamId,
                  userId: userId, 
                }
              });

              if (audience) {
                // Audience exists, update it
                audience = await tx.audience.update({
                  where: { id: audience.id },
                  data: {
                    description: suggestion.description || null,
                    tags: suggestion.tags || [], // Ensure tags are an array
                    // teamId and userId are typically not updated after creation
                  },
                });
                console.log(`[Generate Outline API] Updated existing audience: ${audience.name} (ID: ${audience.id})`);
              } else {
                // Audience does not exist, create it
                audience = await tx.audience.create({
                  data: {
                    name: suggestion.audience_name,
                    description: suggestion.description || null,
                    tags: suggestion.tags || [], // Ensure tags are an array
                    teamId: teamId,
                    userId: userId,
                  },
                });
                console.log(`[Generate Outline API] Created new audience: ${audience.name} (ID: ${audience.id})`);
              }
              createdAudienceIds.push(audience.id);
            } else {
              console.warn("[Generate Outline API] Invalid audience object in parsed structured_output:", suggestion);
            }
          }
        } else {
          console.log("[Generate Outline API] No structured_output string found or it was empty in Dify response.");
        }

        // Create the Outline
        const baseTitle = userProvidedTitle || `Outline - ${styleProfile.name} - ${new Date().toISOString().substring(0, 10)}`;
        const finalUniqueTitle = await findUniqueOutlineTitle(baseTitle, teamId, tx); 
        
        const outline = await tx.outline.create({
          data: {
            title: finalUniqueTitle,
            content: generatedOutlineMarkdown,
            styleProfileId: styleProfileId,
            userKeyPoints: userKeyPoints,
            teamId: teamId,
            userId: userId, 
            merchandiseId: merchandiseId || null,
          },
          include: { 
            styleProfile: { select: { name: true } },
          },
        });
        console.log(`[Generate Outline API] Created new outline: ${outline.title} (ID: ${outline.id})`);

        // Link audiences to the new outline
        if (createdAudienceIds.length > 0) {
          await tx.outlineAudience.createMany({
            data: createdAudienceIds.map(audienceId => ({
              outlineId: outline.id,
              audienceId: audienceId,
              // assignedAt: new Date(), // Optional: if you want to track when it was assigned
            })),
          });
          console.log(`[Generate Outline API] Linked ${createdAudienceIds.length} audiences to outline ID: ${outline.id}`);
        }

        return outline; // Return the created outline from the transaction
      });

      // After the transaction, re-fetch the newOutline with all necessary includes for the frontend form
      const fullNewOutline = await prisma.outline.findUnique({
        where: { id: newOutline.id },
        include: {
          styleProfile: { select: { id: true, name: true } }, // id might be needed if not already on newOutline
          merchandise: { select: { id: true, name: true } }, // id might be needed
          outlineAudiences: {
            include: {
              audience: { // Include full audience details
                select: {
                  id: true,
                  name: true,
                  description: true,
                  tags: true,
                  type: true, // Assuming 'type' field exists on Audience model
                }
              }
            }
          }
        }
      });

      if (!fullNewOutline) {
        // This should ideally not happen if transaction succeeded
        console.error(`[Generate Outline API] Failed to re-fetch the newly created outline with ID: ${newOutline.id}`);
        return NextResponse.json({ message: 'Outline created but failed to retrieve full details' }, { status: 500 });
      }

      // Return the newly created outline (or a subset of its data) to the client
      return NextResponse.json({ 
        message: 'Outline generated and saved successfully', 
        outline: fullNewOutline // Return the complete outline object
      }, { status: 201 });

    } catch (fetchError: any) {
      console.error('Error calling Dify Flow 2 API or processing its response:', fetchError);
      // Specific check for P2002 from within the transaction (though findUniqueOutlineTitle should prevent it)
      if (fetchError instanceof Prisma.PrismaClientKnownRequestError && fetchError.code === 'P2002') {
        const target = fetchError.meta?.target as string[] | undefined;
        if (target && target.includes('title') && target.includes('teamId')) {
          return NextResponse.json({ message: 'An outline with this title already exists in your team. Please use a different title.' }, { status: 409 });
        }
      }
      return NextResponse.json({ message: `Error calling Dify service or processing its response: ${fetchError.message}` }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in /api/outlines/generate:', error);
    // Handle potential Prisma errors or other unexpected errors
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      if (target && target.includes('title') && target.includes('teamId')) {
        return NextResponse.json({ message: 'An outline with this title already exists in your team. Please use a different title or let the system generate one.' }, { status: 409 });
      }
    } else if (error.code === 'P2003' && error.meta?.field_name?.includes('styleProfileId')) {
      return NextResponse.json({ message: 'Associated style profile not found' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Unknown error occurred while generating outline', details: error.message }, { status: 500 });
  }
} 