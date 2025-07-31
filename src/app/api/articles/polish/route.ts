import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next"; 
import { authOptions } from '@/lib/authOptions';

// Zod schema for validating the request body
const polishArticleSchema = z.object({
  user_query: z.string().min(1, { message: 'User query cannot be empty.' }),
  selected_text: z.string().optional().nullable(),
  full_article_context: z.string().optional().nullable(),
  conversation_id: z.string().optional().nullable(), // If you plan to manage conversation IDs explicitly
  // 业务上下文字段 - 用于更精准的AI润色
  style_profile: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    authorInfo: z.any().optional(),
    styleFeatures: z.any().optional(),
    sampleText: z.string().optional(),
  }).optional().nullable(),
  target_audience: z.string().optional().nullable(),
  article_topic: z.string().optional().nullable(),
  writing_purpose: z.array(z.string()).optional().nullable(),
  // teamId: z.string().min(1, { message: "Team ID is required" }), // Assuming team context might be needed
  // articleId: z.string().cuid({ message: "Invalid Article ID" }).optional().nullable(), // If linking to an article
});

// Define expected structure for Dify's response (the content of 'answer' field after parsing)
interface DifyParsedAnswer {
  status: 'success' | 'error';
  error_message?: string;
  data?: {
    suggestion_type: 'REPLACEMENT' | 'REWRITE_SECTION' | 'COMMENT' | 'CLARIFICATION_NEEDED';
    original_selection_for_context?: string | null;
    suggested_content: string;
    explanation?: string | null;
    follow_up_questions?: string[] | null;
  };
}

export async function POST(request: NextRequest) {
  console.log("[Polish Article API] Received request");
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session?.user?.email) { 
      console.error('[Polish Article API] Unauthorized: User session, ID, or email not found.');
      return NextResponse.json({ message: 'Unauthorized: User session, ID, or email not found.' }, { status: 401 });
    }
    const userId = session.user.id; 
    const userEmailForDify = session.user.email; 

    const body = await request.json();
    const validation = polishArticleSchema.safeParse(body);

    if (!validation.success) {
      console.error("[Polish Article API] Invalid request parameters:", validation.error.issues);
      return NextResponse.json({ message: 'Invalid request parameters', errors: validation.error.issues }, { status: 400 });
    }

    const { 
      user_query, 
      selected_text, 
      full_article_context, 
      conversation_id,
      style_profile,
      target_audience,
      article_topic,
      writing_purpose
      // teamId, // Uncomment if team context is needed
      // articleId // Uncomment if you want to associate this with a specific article
    } = validation.data;

    // Get Dify credentials from environment variables
    // DIFY_API_ENDPOINT_CHAT should be your specific Dify API endpoint for chat messages (e.g., https://api.dify.ai/v1/chat-messages)
    const difyChatEndpoint = process.env.DIFY_API_ENDPOINT_CHAT; 
    const difyAppToken = process.env.DIFY_FLOW7_APP_TOKEN;

    if (!difyChatEndpoint || !difyAppToken) { 
      console.error("[Polish Article API] Dify Chat Endpoint (DIFY_API_ENDPOINT_CHAT) or Flow 7 App Token (DIFY_FLOW7_APP_TOKEN) is not configured correctly in .env.local.");
      return NextResponse.json({ message: 'AI Polishing service configuration is incomplete.' }, { status: 500 });
    }

    // Ensure difyChatEndpoint does not end with a slash to prevent double slashes if not already perfectly formed
    // Although DIFY_API_ENDPOINT_CHAT is expected to be the full path, this is a safeguard.
    const targetDifyUrl = difyChatEndpoint.replace(/\/$/, ''); 

    // 【上下文感知增强】构建Dify输入参数
    const difyInputs: any = {
      user_email: userEmailForDify  // 统一的用户识别参数
    }; 
    
    // 检查是否有选中文本，分两种情况处理
    const hasSelectedText = selected_text && selected_text.trim().length > 0;
    
    if (hasSelectedText) {
      console.log("[Polish Article API] Context Mode: WITH_SELECTION - 有选中文本的上下文感知模式");
      // 情况1：有选中文本 - 传递选中文本和完整文章上下文
      difyInputs.selected_text = selected_text.trim();
      difyInputs.full_article_context = full_article_context || "";
      difyInputs.context_mode = "WITH_SELECTION";
      difyInputs.has_selection = true;
    } else {
      console.log("[Polish Article API] Context Mode: NO_SELECTION - 无选中文本的通用优化模式");
      // 情况2：无选中文本 - 只传递完整文章上下文，用于通用建议
      difyInputs.full_article_context = full_article_context || "";
      difyInputs.context_mode = "NO_SELECTION";
      difyInputs.has_selection = false;
      // 不传递selected_text字段，或设置为空字符串
      difyInputs.selected_text = "";
    }

    // 【业务上下文增强】添加风格配置、受众、主题等信息
    if (style_profile) {
      difyInputs.style_profile = JSON.stringify(style_profile);
      console.log("[Polish Article API] 传递风格配置信息到Dify");
    }
    
    if (target_audience && target_audience.trim()) {
      difyInputs.target_audience = target_audience.trim();
      console.log("[Polish Article API] 传递目标受众信息到Dify:", target_audience);
    }
    
    if (article_topic && article_topic.trim()) {
      difyInputs.article_topic = article_topic.trim();
      console.log("[Polish Article API] 传递文章主题信息到Dify:", article_topic);
    }
    
    if (writing_purpose && Array.isArray(writing_purpose) && writing_purpose.length > 0) {
      difyInputs.writing_purpose = writing_purpose.join(', ');
      console.log("[Polish Article API] 传递写作目的信息到Dify:", writing_purpose.join(', '));
    }

    const difyRequestBody: any = {
      inputs: difyInputs, 
      query: user_query, 
      response_mode: 'blocking', 
      user: userEmailForDify, 
    };

    if (conversation_id) {
      difyRequestBody.conversation_id = conversation_id;
    }

    // Define headers for the Dify API call
    const headersForDify: Record<string, string> = {
      'Authorization': `Bearer ${difyAppToken}`,
      'Content-Type': 'application/json',
    };

    console.log(`[Polish Article API] Calling Dify. Target URL: ${targetDifyUrl}`);
    console.log("[Polish Article API] Context Mode:", hasSelectedText ? "WITH_SELECTION" : "NO_SELECTION");
    console.log("[Polish Article API] Dify Request Method: POST");
    console.log("[Polish Article API] Dify Request Headers:", JSON.stringify(headersForDify, null, 2));
    console.log("[Polish Article API] Dify Request Body (context-aware):", JSON.stringify(difyRequestBody, null, 2));

    let difyResponseData;
    try {
      const difyResponse = await fetch(targetDifyUrl, { // Use the correctly constructed targetDifyUrl
        method: 'POST',
        headers: headersForDify, 
        body: JSON.stringify(difyRequestBody),
      });

      console.log(`[Polish Article API] Dify API response status: ${difyResponse.status}`);

      if (!difyResponse.ok) {
        const errorText = await difyResponse.text();
        console.error('[Polish Article API] Dify Chatflow API request failed. Status:', difyResponse.status, 'Error:', errorText);
        let errorJson;
        try {
          errorJson = JSON.parse(errorText);
        } catch (e) { /* not json */ }
        const errorMessage = errorJson?.message || errorJson?.error?.message || `Dify API error (${difyResponse.status})`;
        return NextResponse.json({ message: `AI Polishing service error: ${errorMessage}`, details: errorText }, { status: difyResponse.status });
      }
      
      difyResponseData = await difyResponse.json();
      // console.log('[Polish Article API] Dify Chatflow API response data (raw):', JSON.stringify(difyResponseData, null, 2));

      const newConversationIdFromDify = difyResponseData?.conversation_id;
      let responseToFrontend: any = {};

      if (difyResponseData && typeof difyResponseData.answer === 'string') {
        try {
          const parsedAnswerContent = JSON.parse(difyResponseData.answer);
          responseToFrontend = {
            ...parsedAnswerContent, 
            ...(newConversationIdFromDify && { conversation_id: newConversationIdFromDify })
          };
          return NextResponse.json(responseToFrontend, { status: 200 });
        } catch (parseError: any) {
          console.warn('[Polish Article API] Failed to parse Dify answer string as JSON, treating as plain text. Raw answer:', difyResponseData.answer, 'Error:', parseError.message);
          
          // Check if the response looks like it might be useful content
          const responseText = difyResponseData.answer.trim();
          if (responseText.length > 10 && !responseText.toLowerCase().includes('error')) {
            // Treat as a general comment/advice from AI
            return NextResponse.json({ 
              status: 'success',
              data: {
                suggestion_type: 'COMMENT',
                suggested_content: responseText,
                explanation: 'The AI provided general advice. While it may not be directly applicable, you can consider the suggestions manually.'
              },
              ...(newConversationIdFromDify && { conversation_id: newConversationIdFromDify })
            }, { status: 200 });
          } else {
            // Return as an error
            const errorMessage = 'The AI service returned an incomplete or unclear response. Please try rephrasing your request.';
            return NextResponse.json({ 
              status: 'error',
              error_message: errorMessage,
              data: {
                suggestion_type: 'ERROR_GENERAL',
                explanation: 'Try being more specific about what you want to improve, or select a specific text section to polish.'
              },
              ...(newConversationIdFromDify && { conversation_id: newConversationIdFromDify })
            }, { status: 200 });
          }
        }
      } else if (difyResponseData && difyResponseData.hasOwnProperty('answer')) {
        console.warn('[Polish Article API] Dify response \'answer\' field was not a string. Using its value directly for suggested_content. Raw answer:', difyResponseData.answer);
        responseToFrontend = {
          status: 'success',
          data: { suggested_content: String(difyResponseData.answer) }, 
          ...(newConversationIdFromDify && { conversation_id: newConversationIdFromDify })
        };
        return NextResponse.json(responseToFrontend, { status: 200 });
      } else {
        console.error('[Polish Article API] Dify Chatflow response structure is missing \'answer\' field. Raw response:', difyResponseData);
        responseToFrontend = {
          message: 'Incorrect result format from AI Polishing service (missing answer field).',
          ...(newConversationIdFromDify && { conversation_id: newConversationIdFromDify })
        };
        return NextResponse.json(responseToFrontend, { status: difyResponseData?.status || 500 }); 
      }

    } catch (difyCallError: any) {
      console.error('[Polish Article API] Error calling Dify service:', difyCallError.message, difyCallError.stack);
      return NextResponse.json({ message: 'Failed to communicate with AI Polishing service.' }, { status: 503 }); // Service Unavailable
    }

  } catch (error: any) {
    console.error('[Polish Article API] General error in POST handler:', error.message, error.stack);
    return NextResponse.json({ message: 'An unknown server error occurred.' }, { status: 500 });
  }
}

// Basic GET handler for testing if the route is set up
export async function GET() {
  return NextResponse.json({ message: "Polish API route is active. Use POST to submit content for polishing." });
}