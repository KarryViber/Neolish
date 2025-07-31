// Corrected: Route Handlers are server-side, no 'use client'

import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma'; // Corrected import for Prisma client
import { z } from 'zod';
import { Prisma, PrismaClient } from '@prisma/client'; // For Prisma.JsonValue and PrismaClient type
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '@/lib/authOptions'; // Updated import path

// Use the DIFY_API_ENDPOINT directly from .env.local, which should be the full URL for workflow run
const DIFY_WORKFLOW_RUN_ENDPOINT = process.env.DIFY_API_ENDPOINT; 
const DIFY_FLOW4_APP_TOKEN = process.env.DIFY_FLOW4_APP_TOKEN;
console.log('RAW DIFY_FLOW4_APP_TOKEN from process.env:', DIFY_FLOW4_APP_TOKEN); // ADDED FOR DEBUGGING
// const DIFY_FLOW4_APP_TOKEN = process.env.DIFY_FLOW4_APP_TOKEN; // Commented out/Removed

// Define expected structures for JSON fields for type safety
interface AuthorInfoForDify { // Matches expected structure within style_profile for Dify
  name?: string;
  summary?: string[];
  links?: string[];
}

interface StyleFeaturesForDify { // Matches expected structure within style_profile for Dify
  summary?: string[];
  // Add other expected fields if any, e.g., tone, voice - based on Dify's need
}

// Define the expected request body schema using Zod for validation
const createArticleSchema = z.object({
  outlineId: z.string().min(1, { message: "Outline ID is required" }),
  targetAudience: z.string().min(1, { message: "Target audience is required" }),
  predefinedPurposeIds: z.array(z.string()).optional().default([]),
  customPurposeTexts: z.array(z.string()).optional().default([]),
  teamId: z.string().min(1, { message: "Team ID is required" }),
});

// Helper function to map predefined purpose IDs to their titles (if needed by Dify)
// For now, Dify payload will use the titles directly if they are sent as IDs.
// If Dify actually needs the descriptive text, this mapping will be important.
// const predefinedPurposeDetails = {
//   awareness: "Brand Awareness",
//   leadgen: "Lead Generation",
//   education: "Education",
//   branding: "Branding",
//   sales: "Sales Promotion",
//   retention: "Customer Retention",
//   seo: "SEO Strategy",
//   recruitment: "Recruitment PR",
// };

// Helper function to find a unique article title within a team
async function findUniqueArticleTitle(
  baseTitle: string,
  teamId: string,
  prismaInstance: PrismaClient // Pass prisma instance, especially if used in a transaction later
): Promise<string> {
  let uniqueTitle = baseTitle;
  let counter = 2;
  const maxBaseLength = 250; 
  const truncatedBaseTitle = baseTitle.length > maxBaseLength ? baseTitle.substring(0, maxBaseLength) : baseTitle;

  let existingArticle = await prismaInstance.article.findFirst({
    where: {
      title: truncatedBaseTitle,
      teamId: teamId,
    },
    select: { id: true }, 
  });

  if (!existingArticle) {
    return truncatedBaseTitle.substring(0, 255);
  }

  while (true) {
    uniqueTitle = `${truncatedBaseTitle} (${counter})`;
    if (uniqueTitle.length > 255) {
      const spaceForCounter = ` (${counter})`.length;
      const furtherTruncatedBase = truncatedBaseTitle.substring(0, 255 - spaceForCounter);
      uniqueTitle = `${furtherTruncatedBase} (${counter})`;
    }

    existingArticle = await prismaInstance.article.findFirst({
      where: {
        title: uniqueTitle,
        teamId: teamId,
      },
      select: { id: true },
    });

    if (!existingArticle) {
      return uniqueTitle; 
    }
    counter++;
    if (counter > 1000) { 
      console.error(`Could not find unique article title for base: ${baseTitle} in team ${teamId} after 1000 attempts.`);
      return `${truncatedBaseTitle.substring(0, 230)} (conflict-${Date.now()})`.substring(0,255);
    }
  }
}

// 新增：任务状态枚举
enum ArticleStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing', 
  DRAFT = 'draft',
  GENERATION_FAILED = 'generation_failed',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// 新增：后台任务队列处理器
class ArticleGenerationQueue {
  private static instance: ArticleGenerationQueue;
  private processingTasks = new Set<string>();

  static getInstance(): ArticleGenerationQueue {
    if (!ArticleGenerationQueue.instance) {
      ArticleGenerationQueue.instance = new ArticleGenerationQueue();
    }
    return ArticleGenerationQueue.instance;
  }

  async addTask(articleId: string, taskParams: {
    outlineContentForDify: string;
    difyStyleProfileObject: any;
    difyWritingPurpose: string;
    difyTargetAudienceObject: any;
    currentUserEmail: string;
  }) {
    console.log(`[Queue] Adding task for article ${articleId}`);
    
    // 避免重复处理
    if (this.processingTasks.has(articleId)) {
      console.log(`[Queue] Task for article ${articleId} already in progress, skipping`);
      return;
    }

    this.processingTasks.add(articleId);
    
    // 更新状态为处理中
    await prisma.article.update({
      where: { id: articleId },
      data: { status: ArticleStatus.PROCESSING }
    });

    // 异步执行任务（不阻塞API响应）
    this.processTaskAsync(articleId, taskParams).finally(() => {
      this.processingTasks.delete(articleId);
    });
  }

  private async processTaskAsync(articleId: string, taskParams: {
    outlineContentForDify: string;
    difyStyleProfileObject: any;
    difyWritingPurpose: string;
    difyTargetAudienceObject: any;
    currentUserEmail: string;
  }) {
    console.log(`[Queue] Starting background processing for article ${articleId}`);
    
    try {
      const difyPayload = {
        inputs: {
          user_email: taskParams.currentUserEmail,
          outline: taskParams.outlineContentForDify,
          style_profile: JSON.stringify(taskParams.difyStyleProfileObject),
          writing_purpose: taskParams.difyWritingPurpose,
          target_audience: JSON.stringify(taskParams.difyTargetAudienceObject),
        },
        response_mode: "blocking",
        user: taskParams.currentUserEmail,
      };

      const endpoint = process.env.DIFY_API_ENDPOINT;
      const token = process.env.DIFY_FLOW4_APP_TOKEN;

      if (!endpoint || !token) {
        throw new Error('Dify endpoint or token missing');
      }

      console.log(`[Queue] Calling Dify API for article ${articleId}`);
      
      const difyResponse = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(difyPayload),
        // 设置一个较长的超时时间，但不会影响API响应
        signal: AbortSignal.timeout(300000) // 5分钟超时
      });

      if (!difyResponse.ok) {
        const errorBody = await difyResponse.text();
        throw new Error(`Dify API error: ${difyResponse.status} - ${errorBody}`);
      }

      const difyResult = await difyResponse.json();
      
      if (difyResult.data && difyResult.data.status === 'succeeded') {
        if (difyResult.data.outputs && typeof difyResult.data.outputs.generated_article === 'string') {
          const generatedArticleContent = difyResult.data.outputs.generated_article;
          const imagePromptsStructured = difyResult.data.outputs.structured_output || null;
          const contentAnalyst = difyResult.data.outputs.content_analyst || null;
          
          await prisma.article.update({
            where: { id: articleId },
            data: {
              content: generatedArticleContent,
              structuredContent: imagePromptsStructured === null ? Prisma.JsonNull : imagePromptsStructured,
              contentAnalyst: contentAnalyst,
              status: ArticleStatus.DRAFT,
            },
          });
          
          console.log(`[Queue] Article ${articleId} generation completed successfully with content analyst`);
        } else {
          throw new Error('Invalid Dify response: missing generated_article');
        }
      } else {
        const difyError = difyResult.data?.error || difyResult.error?.message || 'Unknown Dify workflow error';
        throw new Error(`Dify workflow failed: ${difyError}`);
      }
    } catch (error: any) {
      console.error(`[Queue] Task failed for article ${articleId}:`, error);
      
      await prisma.article.update({
        where: { id: articleId },
        data: { 
          status: ArticleStatus.GENERATION_FAILED,
          content: `Generation failed: ${error.message}`
        }
      });
    }
  }

  // 获取队列状态
  getQueueStatus() {
    return {
      processingCount: this.processingTasks.size,
      processingTasks: Array.from(this.processingTasks)
    };
  }
}

// Define the mapping for predefined purposes to their display titles
const predefinedPurposeDisplayMap: { [key: string]: string } = {
  'awareness': 'Brand Awareness',
  'leadgen': 'Lead Generation',
  'education': 'Education',
  'branding': 'Branding',
  'sales': 'Sales Promotion',
  'retention': 'Customer Retention',
  'seo': 'SEO Strategy',
  'recruitment': 'Recruitment PR',
};

// Helper function to title case a string (capitalize first letter of each word)
function titleCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

export async function POST(request: NextRequest) {
  console.log('POST /api/articles invoked.');
  if (!DIFY_WORKFLOW_RUN_ENDPOINT || !DIFY_FLOW4_APP_TOKEN) {
    console.error('Dify integration not configured (endpoint or token missing).');
    return NextResponse.json({ error: 'Internal server error: Dify integration misconfigured.' }, { status: 500 });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    console.error('[Articles API] Unauthorized: User email not found in session');
    return NextResponse.json({ message: "Unauthorized: User email not found in session" }, { status: 401 });
  }
  const currentUserEmail = session.user.email;

  let requestBody;
  try {
    requestBody = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }
  
  const validation = createArticleSchema.safeParse(requestBody);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid request data.', details: validation.error.format() }, { status: 400 });
  }

  const { outlineId, targetAudience, predefinedPurposeIds, customPurposeTexts, teamId } = validation.data;

  // Combine predefined and custom purposes into a single list of unique strings
  const allPurposeStrings = Array.from(new Set([
    ...predefinedPurposeIds,
    ...customPurposeTexts.filter(text => text.trim() !== '') // Filter out empty custom texts
  ]));

  if (allPurposeStrings.length === 0) {
    return NextResponse.json({ error: 'At least one writing purpose must be provided.' }, { status: 400 });
  }

  try {
    const outlineData = await prisma.outline.findUnique({ where: { id: outlineId } });
    if (!outlineData) return NextResponse.json({ error: 'Outline not found.' }, { status: 404 });

    const { content: outlineContentForDify, styleProfileId } = outlineData;
    if (!outlineContentForDify || !styleProfileId) {
      return NextResponse.json({ error: 'Outline data is incomplete (missing content or style profile ref).'}, { status: 400 });
    }

    const styleProfileData = await prisma.styleProfile.findUnique({ where: { id: styleProfileId } });
    if (!styleProfileData) return NextResponse.json({ error: 'Style profile not found.' }, { status: 404 });
    
    // Prepare Dify style profile object (once, before the loop)
    const difyStyleProfileObject = {
      source_url: (styleProfileData as any).sourceUrl || "",
      author_profile: styleProfileData.authorInfo ? JSON.parse(JSON.stringify(styleProfileData.authorInfo)) : { name: "Default Author", summary: [], links: [] },
      style_summary: styleProfileData.styleFeatures ? JSON.parse(JSON.stringify(styleProfileData.styleFeatures)) : { summary_points: [] },
      sample_texts: styleProfileData.sampleText ? [styleProfileData.sampleText] : [],
      writing_style: (styleProfileData as any).writingStyle || "default",
    };

    // Prepare Dify target audience object (once, before the loop)
    const difyTargetAudienceObject = { 
      audience_name: targetAudience, 
      description: "", 
      tags: [] 
    };

    // Find Audience ID for storing in Article.targetAudienceIds
    let finalAudienceId: string | undefined;
    const existingAudience = await prisma.audience.findUnique({ 
      where: { 
        name_teamId: { 
          name: targetAudience, 
          teamId: teamId
        } 
      } 
    });

    if (existingAudience) {
      finalAudienceId = existingAudience.id;
    } else {
      console.warn(`Audience named "${targetAudience}" not found. Article will be created without an audience ID unless auto-creation is implemented.`);
    }
    
    let createdArticlesCount = 0;
    const createdArticleIds: string[] = [];
    const processingErrors: { purpose: string, error: string }[] = [];
    
    const queue = ArticleGenerationQueue.getInstance();

    console.log(`Initiating article generation for ${allPurposeStrings.length} purposes.`);

    for (const currentPurposeString of allPurposeStrings) {
      let baseArticleTitleForErrorLog = '';
      try {
        console.log(`Processing purpose: \"${currentPurposeString}\" for outline ${outlineId}`);
        const baseArticleTitle = `${outlineData.title || 'Untitled Outline'} (Purpose: ${currentPurposeString})`;
        baseArticleTitleForErrorLog = baseArticleTitle;
        
        const finalUniqueArticleTitle = await findUniqueArticleTitle(baseArticleTitle, teamId, prisma);

        // 创建文章记录，初始状态为队列中
        const initialArticle = await prisma.article.create({
          data: {
            title: finalUniqueArticleTitle.substring(0, 255),
            status: ArticleStatus.QUEUED, // 新状态：排队中
            outline: {
              connect: { id: outlineId }
            },
            styleProfile: {
              connect: { id: styleProfileId }
            },
            targetAudienceIds: finalAudienceId ? [finalAudienceId] : [],
            writingPurpose: [currentPurposeString],
            content: '', // 初始为空，将在后台生成
            team: {
              connect: { id: teamId }
            },
            user: {
              connect: { id: session.user.id }
            },
          },
        });

        console.log(`[Article Create ${initialArticle.id}] Article queued for purpose: "${currentPurposeString}"`);

        // 添加到后台队列处理（异步，不等待）
        await queue.addTask(initialArticle.id, {
          outlineContentForDify,
          difyStyleProfileObject,
          difyWritingPurpose: currentPurposeString,
          difyTargetAudienceObject,
          currentUserEmail
        });

        createdArticlesCount++;
        createdArticleIds.push(initialArticle.id);
        
      } catch (loopError: any) {
        console.error(`Error in loop for purpose \"${currentPurposeString}\":`, loopError);
        if (loopError instanceof Prisma.PrismaClientKnownRequestError && loopError.code === 'P2002') {
          const target = loopError.meta?.target as string[] | undefined;
          if (target && target.includes('title')) {
             console.error(`Unique constraint failed for a title derived from: \"${baseArticleTitleForErrorLog}\" in team ${teamId}`);
             processingErrors.push({ purpose: currentPurposeString, error: `Failed to create article due to title conflict for '${baseArticleTitleForErrorLog}'. Please try a different outline title or purpose.` });
             continue;
          }
        }
        processingErrors.push({ purpose: currentPurposeString, error: loopError.message || 'Unknown error in loop' });
      }
    }

    if (createdArticlesCount > 0) {
      const queueStatus = queue.getQueueStatus();
      let message = `Successfully queued ${createdArticlesCount} article(s) for generation.`;
      if (processingErrors.length > 0) {
        message += ` However, ${processingErrors.length} purpose(s) failed to queue.`;
      }
      
      return NextResponse.json({ 
        message,
        queuedArticles: createdArticleIds,
        queueStatus,
        processingErrors 
      }, { status: 202 }); // 202 Accepted - 请求已接受，正在处理
    } else {
      return NextResponse.json({ 
        error: "Failed to queue any article generation tasks.", 
        details: processingErrors 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Overall error in POST /api/articles:', error);
    return NextResponse.json({ error: 'Failed to create article(s).', details: error.message }, { status: 500 });
  }
}

// Helper function to get articles (existing GET function, can be reviewed/optimized separately if needed)
// ... existing GET function ...
// Ensure GET function also correctly retrieves new statuses like 'processing' and 'generation_failed'
// And potentially the 'content' field if it contains error messages for 'generation_failed' status

export async function GET(request: NextRequest) {
  try {
    // --- Get user session and team IDs ---
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const memberships = await prisma.membership.findMany({
      where: { userId: userId },
      select: { teamId: true },
    });
    const userTeamIds = memberships.map(m => m.teamId);

    if (userTeamIds.length === 0) {
      // If user is not part of any team, return empty list (or handle as needed)
      return NextResponse.json({ articles: [], totalCount: 0 });
    }
    // --- End session and team IDs ---

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchTerm = searchParams.get("searchTerm") || "";
    const statusFilter = searchParams.get("status") || "All";
    const purposeFilter = searchParams.get("purpose") || ""; 
    const audienceFilter = searchParams.get("audience") || ""; 

    const skip = (page - 1) * limit;

    // Initial whereClause for Prisma
    const prismaWhereClause: Prisma.ArticleWhereInput = {
      // --- Add Team ID filter ---
      teamId: {
        in: userTeamIds,
        // We only fetch articles that belong to the user's teams.
        // This implicitly handles teamId: null as they won't be in userTeamIds.
      }
      // --- End Team ID filter ---
    };

    if (searchTerm) {
      prismaWhereClause.title = { contains: searchTerm, mode: 'insensitive' };
    }

    if (statusFilter && statusFilter.toLowerCase() !== 'all') {
      prismaWhereClause.status = statusFilter;
    }
    
    // Fetch all potentially relevant articles based on DB-level filters first
    // We will apply purpose and audience filters in application code for fuzzy matching on arrays
    console.log("Backend GET /api/articles with DB-level prismaWhereClause:", JSON.stringify(prismaWhereClause));

    let allMatchingArticles = await prisma.article.findMany({
      where: prismaWhereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        outline: { select: { title: true } },
        styleProfile: { select: { name: true } },
        user: { select: { username: true } } // Added: Include user's username
      }
    });

    // Collect all unique audience IDs
    const audienceIds = new Set<string>();
    allMatchingArticles.forEach(article => {
      if (article.targetAudienceIds && Array.isArray(article.targetAudienceIds)) {
        article.targetAudienceIds.forEach(id => audienceIds.add(id));
      }
    });

    // Fetch audience names
    const audienceIdArray = Array.from(audienceIds);
    const audienceMap = new Map<string, string>();
    if (audienceIdArray.length > 0) {
      const audiences = await prisma.audience.findMany({
        where: {
          id: { in: audienceIdArray }
        },
        select: { id: true, name: true }
      });
      audiences.forEach(aud => audienceMap.set(aud.id, aud.name));
    }
    
    // Apply fuzzy filtering for purpose in application code
    if (purposeFilter) {
      allMatchingArticles = allMatchingArticles.filter(article =>
        (article.writingPurpose || []).some(purpose => 
          purpose.toLowerCase().includes(purposeFilter.toLowerCase())
        )
      );
    }

    // Apply fuzzy filtering for audience name in application code (after fetching names)
    if (audienceFilter) {
      allMatchingArticles = allMatchingArticles.filter(article => {
        if (article.targetAudienceIds && Array.isArray(article.targetAudienceIds)) {
          return article.targetAudienceIds.some(id => {
            const name = audienceMap.get(id);
            return name ? name.toLowerCase().includes(audienceFilter.toLowerCase()) : false;
          });
        }
        return false;
      });
    }

    const totalCount = allMatchingArticles.length;
    const paginatedArticles = allMatchingArticles.slice(skip, skip + limit);

    const transformedArticles = paginatedArticles.map(article => {
      // Log original writingPurpose
      console.log(`[Article ID: ${article.id}] Original article.writingPurpose:`, JSON.stringify(article.writingPurpose));

      let displayAudience = '';
      if (article.targetAudienceIds && Array.isArray(article.targetAudienceIds)) {
        displayAudience = article.targetAudienceIds
          .map(id => audienceMap.get(id) || id) // Use name if found, else fallback to ID
          .join(', ');
      }

      const processedWritingPurposes = Array.isArray(article.writingPurpose)
        ? article.writingPurpose
            .map(purposeIdentifier => {
              if (typeof purposeIdentifier === 'string' && purposeIdentifier.length > 0) {
                // Check if it's a predefined purpose ID (convert to lower to be safe with map keys)
                const predefinedTitle = predefinedPurposeDisplayMap[purposeIdentifier.toLowerCase()];
                // If it's a known predefined purpose, use its title. Otherwise, assume it's custom text.
                return predefinedTitle || purposeIdentifier;
              } 
              return String(purposeIdentifier); // Fallback for non-string or empty string values
            })
            .filter(p => p && p.trim() !== '') // Filter out any empty or null purposes after mapping
        : [];

      // console.log(`[Article ID: ${article.id}] Processed article.writingPurpose for display:`, JSON.stringify(processedWritingPurposes));

      return {
        ...article,
        // Ensure Prisma.JsonValue fields are correctly typed or cast if necessary
        writingPurpose: processedWritingPurposes as string[], // Explicitly type as string[] for frontend
        targetAudienceDisplay: displayAudience, // Send the mapped audience names
        outlineTitle: article.outline?.title,
        styleProfileName: article.styleProfile?.name,
        user: article.user // Pass through the user object (which includes username)
      };
    });

    // console.log("Backend GET /api/articles, transformed articles sample:", JSON.stringify(transformedArticles.slice(0,1), null, 2));
    return NextResponse.json({ articles: transformedArticles, totalCount });

  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles.", details: error.message },
      { status: 500 }
    );
  }
} 