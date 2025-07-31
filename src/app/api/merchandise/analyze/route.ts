import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// Dify API Configuration for Merchandise Analysis (Flow 10)
const DIFY_FLOW10_APP_TOKEN = process.env.NEXT_PUBLIC_DIFY_FLOW10_APP_TOKEN || '';
const DIFY_API_ENDPOINT = process.env.DIFY_API_ENDPOINT;

export async function POST(request: NextRequest) {
  console.log("POST /api/merchandise/analyze called.");

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.error('[Merchandise Analyze API] Unauthorized: User email not found in session');
      return NextResponse.json({ error: 'Unauthorized: User email not found in session' }, { status: 401 });
    }
    const currentUserEmail = session.user.email;
    const userId = session.user.id;

    // We expect FormData because file upload is primary, but URL analysis also comes here.
    const formData = await request.formData();
    // Instead of the raw file, we expect a JSON string describing the file uploaded to Dify by the client
    const difyFileJsonString = formData.get('dify_file_json_string') as string | null;
    const sourceUrlFromFormData = formData.get('sourceUrl') as string | null; // Key used by frontend if it's a URL analysis through this path
    const teamId = formData.get('teamId') as string | null;

    if (!teamId) {
      return NextResponse.json({ error: "Team ID (teamId) is required in FormData." }, { status: 400 });
    }

    // Verify user belongs to the provided teamId
    const membership = await prisma.membership.findUnique({
      where: { userId_teamId: { userId: userId, teamId: teamId } }
    });
    if (!membership) {
      return NextResponse.json({ error: 'Forbidden: User is not a member of the specified team.' }, { status: 403 });
    }

    if (!DIFY_FLOW10_APP_TOKEN || !DIFY_API_ENDPOINT) {
      console.error('Dify Flow 10 App Token or API Endpoint is not configured.');
      return NextResponse.json({ error: 'Merchandise analysis service is not configured.' }, { status: 500 });
    }

    let difyCallBody: string;
    const difyHeaders: HeadersInit = {
      'Authorization': `Bearer ${DIFY_FLOW10_APP_TOKEN}`,
      'Content-Type': 'application/json', // All calls to Dify Flow will be JSON
    };
    let logMessage = '';
    const difyJsonPayload: any = {
      response_mode: 'blocking', // Keep this for direct results
      user: '', // Will be set below
      inputs: {},
    };

    if (difyFileJsonString) {
      try {
        const difyFileObject = JSON.parse(difyFileJsonString);
        // Ensure the structure from frontend matches what Dify Flow expects for 'merchandise_flies'
        // Based on user's example, Dify Flow expects the full object.
        difyJsonPayload.inputs.merchandise_flies = difyFileObject; 
        logMessage = `Calling Dify Flow 10 with Dify file object: ${difyFileObject.filename || 'unknown file'} for 'merchandise_flies'. User: ${currentUserEmail}`;
        difyJsonPayload.user = currentUserEmail;
      } catch (e) {
        console.error("Failed to parse dify_file_json_string:", e);
        return NextResponse.json({ error: "Invalid format for dify_file_json_string." }, { status: 400 });
      }
    } else if (sourceUrlFromFormData) {
      difyJsonPayload.inputs.merchandise_url = sourceUrlFromFormData; // Dify input field for URL
      logMessage = `Calling Dify Flow 10 with URL: ${sourceUrlFromFormData} for 'merchandise_url'. User: ${currentUserEmail}`;
      difyJsonPayload.user = currentUserEmail;
    } else {
      return NextResponse.json({ error: "Either a Dify file JSON string (dify_file_json_string) or a URL (sourceUrl) is required in FormData." }, { status: 400 });
    }

    difyCallBody = JSON.stringify(difyJsonPayload);
    console.log(logMessage);
    // console.log("Sending to Dify:", difyCallBody); // Optional: log the exact payload
        
    const difyResponse = await fetch(DIFY_API_ENDPOINT, {
      method: 'POST',
      headers: difyHeaders,
      body: difyCallBody,
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
      return NextResponse.json({ error: `Dify API call failed: ${errorMessage}`, details: errorText }, { status: difyResponse.status === 200 ? 500 : difyResponse.status });
    }
    
    const difyResult = await difyResponse.json();
    console.log('Dify API response data (raw):', JSON.stringify(difyResult, null, 2)); // For debugging

    // Extract the merchandise summary from Dify's output.
    // The output key ('merchandise_summary') must match your Dify Flow 10 configuration.
    const merchandiseSummary = difyResult?.data?.outputs?.merchandise_summary;
    const merchandiseTagString = difyResult?.data?.outputs?.merchandise_tag;

    if (typeof merchandiseSummary !== 'string') {
      console.error("Dify response structure is not as expected or merchandise_summary is missing/invalid:", difyResult);
      return NextResponse.json({ error: "Merchandise analysis result format is incorrect or summary is missing." }, { status: 500 });
    }

    let tags: string[] = [];
    if (typeof merchandiseTagString === 'string' && merchandiseTagString.trim() !== '') {
      tags = merchandiseTagString.split(',').map(tag => tag.trim()).filter(tag => tag);
      console.log("Merchandise tags extracted:", tags);
    } else {
      console.log("No merchandise_tag found in Dify output or it was empty.");
    }

    console.log("Merchandise analysis successful. Summary:", merchandiseSummary);
    return NextResponse.json({ summary: merchandiseSummary, tags: tags });

  } catch (error: any) {
    console.error("Error in /api/merchandise/analyze POST handler:", error);
    return NextResponse.json({ error: error.message || "An unknown server error occurred during merchandise analysis." }, { status: 500 });
  }
} 