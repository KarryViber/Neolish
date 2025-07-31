import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from "@/lib/authOptions";

// Aggressively try to clear Prisma Client from module cache - FOR DEBUGGING ONLY
const prismaClientPath = require.resolve('@prisma/client');
if (require.cache[prismaClientPath]) {
  delete require.cache[prismaClientPath];
  console.log('Cleared @prisma/client from require cache FOR DEBUGGING');
}
// END DEBUGGING CODE

const prisma = new PrismaClient();

// Updated Zod schema for request body validation
const analyzeUrlBodySchema = z.object({
  urls: z.array(z.string().url({ message: 'Please enter a valid URL' })).min(1, "At least one URL is required"),
  analysisProfileName: z.string().optional().nullable(),
  teamId: z.string().min(1, "Team ID is required"), // teamId is expected from the client
});

interface DifyAuthorProfile {
  name?: string;
  summary?: string[];
  links?: string[]; // Though not used in current transformation to string
}

// Assuming style_summary from Dify is an array of strings as per recent logs
// If it can be an object with summary_points, this function needs to know the exact structure
// For now, let's base it on the provided log: difyOutput.style_summary as string[]

// Helper function to find a unique name for the style profile
async function findUniqueName(baseName: string, teamId: string): Promise<string> {
  let uniqueName = baseName;
  let counter = 1;
  // Loop indefinitely until a unique name is found or a safety break (e.g., max attempts)
  // For simplicity, this example doesn't have a max attempt, but in production, you might add one.
  while (true) {
    const existingProfile = await prisma.styleProfile.findFirst({
      where: {
        name: uniqueName,
        teamId: teamId, // Ensure uniqueness within the team
      },
      select: { id: true }, // Only need to check for existence
    });

    if (!existingProfile) {
      return uniqueName; // Found a unique name
    }

    // Name exists, increment counter and try a new name
    counter++;
    uniqueName = `${baseName} (${counter})`;
    if (uniqueName.length > 255) { // Prisma schema usually has a length limit for strings
        // Handle case where appending counter exceeds length limit
        // This might involve truncating baseName or a different naming strategy
        // For now, just using a slightly modified baseName to avoid infinite loop on very long names + counter
        const shortBase = baseName.substring(0, 240); // Max length - space for counter & parens
        uniqueName = `${shortBase} (${counter})`;
        if (uniqueName.length > 255) { // Still too long, very unlikely, but as a safeguard
            // Fallback to a more generic name + random string if truly stuck
            // This is an edge case, ideally schema allows enough length or baseName is not excessively long.
            console.warn(`Generated name still too long after truncation: ${uniqueName}. Base: ${baseName}`);
            // As a very basic fallback, could use a short prefix + timestamp or random string.
            // For this example, we'll just let it try and potentially fail if it hits this unlikely scenario.
            // Or throw an error to indicate a naming convention issue.
            // throw new Error('Could not generate a unique name within length constraints.');
            // For now, let's just return the truncated name and hope for the best, or log and continue
        }
    }
  }
}

function transformDifyOutputToStyleProfile(difyOutput: any, sourceUrlInput: string, styleProfileNameInput: string | undefined) {
  const authorProfile = difyOutput.author_profile as DifyAuthorProfile | undefined;
  const styleSummaryArray = difyOutput.style_summary as string[] | undefined; // Based on log: array of strings
  const sampleTextsArray = difyOutput.sample_texts as string[] | undefined;

  let authorInfoString = 'N/A';
  if (authorProfile) {
    const parts: string[] = [];
    if (authorProfile.name) {
      parts.push(`Name: ${authorProfile.name}`);
    }
    if (authorProfile.summary && authorProfile.summary.length > 0) {
      if (parts.length > 0) parts.push('\n'); // Add a blank line if name was present
      parts.push('Summary:');
      parts.push(...authorProfile.summary);
    }
    authorInfoString = parts.join('\n');
  }

  let styleFeaturesString = 'N/A';
  if (styleSummaryArray && styleSummaryArray.length > 0) {
    styleFeaturesString = styleSummaryArray.join('\n');
  }

  // sampleText remains the same: join array with a specific separator
  const sampleTextString = sampleTextsArray && sampleTextsArray.length > 0 
    ? sampleTextsArray.join('\n\n---\n\n') 
    : 'N/A';

  const profileName = styleProfileNameInput || 
                      authorProfile?.name || 
                      (sourceUrlInput ? `Profile from ${new URL(sourceUrlInput.split(/[,\s\n]+/)[0]).hostname}` : 'Untitled Style Profile');

  const transformed = {
    name: profileName.substring(0, 255), // Initial name, might be adjusted for uniqueness later
    description: `Style profile for ${authorProfile?.name || 'source'} from URL: ${sourceUrlInput}`.substring(0, 1000),
    authorInfo: authorInfoString,     // Now a direct string
    styleFeatures: styleFeaturesString, // Now a direct string
    sampleText: sampleTextString,
    // sourceUrl is intentionally NOT part of the direct return for StyleProfile creation data anymore based on previous fixes
    // It might be logged or used for description only.
  };
  console.log("Data transformed for Prisma:", JSON.stringify(transformed, null, 2));
  return transformed;
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body using the new schema
    const validationResult = analyzeUrlBodySchema.safeParse(await request.json());

    if (!validationResult.success) {
      return NextResponse.json({ message: 'Invalid request parameters', errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    // Get data from the validated request body
    const { urls, analysisProfileName: analysisProfileNameFromRequest, teamId: teamIdFromRequest } = validationResult.data;

    // Get session and user email
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) { 
      console.error('Unauthorized: User email not found in session');
      return NextResponse.json({ message: "Unauthorized: User email not found in session" }, { status: 401 });
    }
    const currentUserEmail = session.user.email;

    // Prepare analysisUrl for Dify (joining if multiple URLs provided)
    const analysisUrlForDify = urls.join('\n'); 

    const difyApiEndpoint = process.env.DIFY_API_ENDPOINT;
    const difyApiKey = process.env.DIFY_API_KEY; 
    const difyUserId = currentUserEmail; 

    if (!difyApiKey || !difyApiEndpoint) {
      console.error('Dify API credentials not configured in .env');
      return NextResponse.json({ message: 'Dify API configuration is incomplete, please check server logs' }, { status: 500 });
    }

    const difyRequestBody = {
      inputs: {
        urls_text: analysisUrlForDify, 
      },
      response_mode: 'blocking', 
      user: difyUserId, 
    };

    let difyCallResponseData; 
    try {
      const difyResponse = await fetch(difyApiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${difyApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(difyRequestBody),
      });
      
      console.log(`Dify API response status: ${difyResponse.status}`);

      if (!difyResponse.ok) {
        const errorText = await difyResponse.text();
        console.error('Dify API request failed:', errorText);
        let errorJson;
        try {
            errorJson = JSON.parse(errorText);
        } catch (e) { /* not json */ }
        const errorMessage = errorJson?.message || errorJson?.error?.message || `Dify API error (${difyResponse.status})`;
        return NextResponse.json({ message: errorMessage, details: errorText }, { status: difyResponse.status });
      }
      
      difyCallResponseData = await difyResponse.json();
      console.log('Dify API response data (raw):', JSON.stringify(difyCallResponseData, null, 2));
      
      // Extract the relevant part of Dify's output
      const difyStructuredOutput = difyCallResponseData?.data?.outputs?.structured_output;

      if (!difyStructuredOutput) {
        console.error("Dify response structure is not as expected (missing structured_output):", difyCallResponseData);
        return NextResponse.json({ message: "Dify API response format is incorrect (missing structured_output)." }, { status: 500 });
      }

      // Transform Dify output
      // Ensure analysisProfileNameFromRequest (which can be null) is converted to undefined if null
      const nameForTransform = analysisProfileNameFromRequest === null ? undefined : analysisProfileNameFromRequest;
      const profileDataToReturn = transformDifyOutputToStyleProfile(difyStructuredOutput, analysisUrlForDify, nameForTransform);

      // The API will now just return the analyzed data, not save it.
      // Include teamIdFromRequest in the response so client can use it for saving later.
      return NextResponse.json({ 
        message: 'URL analyzed successfully. Please review and save.', 
        analyzedProfileData: { 
          ...profileDataToReturn,
          teamId: teamIdFromRequest // Pass teamId back to the client
        }
      }, { status: 200 });

    } catch (fetchError: any) {
      console.error("Error during Dify API call:", fetchError);
      const errorMessage = 'Unknown error occurred while analyzing URL with Dify';
      return NextResponse.json({ message: errorMessage, details: fetchError.message ? fetchError.message : fetchError }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in /api/style-profiles/analyze-url:', error);
    // This top-level catch is for request parsing errors (handled by Zod check now) or unexpected issues.
    // If it's not a ZodError, it's an unexpected server error.
    if (error instanceof z.ZodError) {
      // This case should ideally be caught by validationResult.success check, but as a safeguard:
      return NextResponse.json({ message: 'Invalid request parameters.', details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}