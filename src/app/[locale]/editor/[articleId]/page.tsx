'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from 'sonner';
import { Label } from "@/components/ui/label";
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
// 替换 MDEditor 为 TiptapEditor
import { TiptapEditor, useTiptapImageIntegration, type TiptapEditorRef, type ImageControlData } from '@/components/editor/tiptap';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, Save, Send, Undo2, Wand2, ImagePlus, Sparkles, RefreshCw, PlusSquare, Ban, CheckCircle, Loader2, Upload, FileImage, ChevronDown, Brain } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import AIResultModal from '@/components/editor/tiptap/AIResultModal'
import { preprocessMarkdownForTiptap } from '@/components/editor/tiptap/utils/markdownTransform';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

// 移除旧的 ImageControlData 接口定义，使用从 Tiptap 导入的版本
// export interface ImageControlData { ... } - 已移除

// --- BEGIN localStorage Helper Functions ---
const getLocalStorageKey = (articleId: string) => `mevius_editor_image_controls_${articleId}`;

const saveImageControlsToLocalStorage = (articleId: string, controls: ImageControlData[]) => {
  if (typeof window !== 'undefined' && articleId) {
    try {
      const key = getLocalStorageKey(articleId);
      const value = JSON.stringify(controls);
      localStorage.setItem(key, value);
      console.log(`[LocalStorage SAVE] Success for article ${articleId}. Key: ${key}, Controls Count: ${controls.length}, First control status: ${controls[0]?.status}, First URL: ${controls[0]?.imageUrl}`);
    } catch (e) {
      console.error("[LocalStorage SAVE] Error saving image controls:", e);
      toast.error("Could not save image states locally. Local storage might be full.");
    }
  } else {
    console.warn(`[LocalStorage SAVE] Skipped. window: ${typeof window !== 'undefined'}, articleId: ${articleId}`);
  }
};

const loadImageControlsFromLocalStorage = (articleId: string): ImageControlData[] | null => {
  if (typeof window !== 'undefined' && articleId) {
    const key = getLocalStorageKey(articleId);
    console.log(`[LocalStorage LOAD] Attempting to load for article ${articleId}. Key: ${key}`);
    try {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        console.log(`[LocalStorage LOAD] Found cachedData for key ${key}. Length: ${cachedData.length}`);
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData) && parsedData.every(item => 
            typeof item === 'object' && 
            item !== null && 
            'placeholderTag' in item && 
            'type' in item && 
            'status' in item
        )) {
            console.log(`[LocalStorage LOAD] Parsed and validated successfully. Controls count: ${parsedData.length}. First control status: ${parsedData[0]?.status}, First URL: ${parsedData[0]?.imageUrl}`);
            return parsedData as ImageControlData[];
        }
        console.warn("[LocalStorage LOAD] Cached data does not match expected structure. Discarding and removing from LS.");
        localStorage.removeItem(key); 
        return null;
      }
      console.log(`[LocalStorage LOAD] No cachedData found for key ${key}.`);
      return null;
    } catch (e) {
      console.error("[LocalStorage LOAD] Error loading or parsing image controls:", e);
      try {
        localStorage.removeItem(key); 
        console.log("[LocalStorage LOAD] Attempted to clear potentially corrupted data after error.");
      } catch (removeError) {
        console.error("[LocalStorage LOAD] Error trying to remove corrupted data:", removeError);
      }
      toast.error("Could not load image states due to an error. Cache may have been cleared.");
      return null;
    }
  } else {
    console.warn(`[LocalStorage LOAD] Skipped. window: ${typeof window !== 'undefined'}, articleId: ${articleId}`);
    return null;
  }
};

const clearImageControlsFromLocalStorage = (articleId: string) => {
  if (typeof window !== 'undefined' && articleId) {
    localStorage.removeItem(getLocalStorageKey(articleId));
    console.log(`[LocalStorage] Cleared image controls for article ${articleId}`);
  }
};
// --- END localStorage Helper Functions ---

// 移除MDEditor动态导入，不再需要
// const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface ArticleForEditor {
  id: string;
  title: string;
  content: string;
  structuredContent: Record<string, any> | null;
  status: string;
  contentAnalyst?: string | null;
  // 业务上下文信息
  writingPurpose?: string[] | null;
  targetAudienceIds?: string[] | null;
  targetAudienceNames?: string[] | null;
  styleProfile?: {
    id: string;
    name: string;
    description?: string | null;
    authorInfo?: any;
    styleFeatures?: any;
    sampleText?: string | null;
  } | null;
}

async function fetchArticleForEditor(articleId: string): Promise<ArticleForEditor | null> {
  console.log(`Fetching article ${articleId} for editor...`);
  try {
    const response = await fetch(`/api/articles/${articleId}`);
    if (!response.ok) {
      let errorMsg = `Failed to fetch article: ${response.statusText}`;
      try { const errorData = await response.json(); errorMsg = errorData.error || errorData.message || errorMsg; } catch (e) { /* Ignore */ }
      throw new Error(errorMsg);
    }
    const data = await response.json();
    if (!data || !data.article) {
        throw new Error("Invalid API response structure for fetching article.");
    }
    if (data.article.structuredContent && typeof data.article.structuredContent === 'string') {
        try {
            let parsed = JSON.parse(data.article.structuredContent);
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            data.article.structuredContent = parsed;
        } catch (e) {
            console.error("Failed to parse structuredContent, treating as null:", e);
            data.article.structuredContent = null;
        }
    } else if (data.article.structuredContent !== null && typeof data.article.structuredContent !== 'object') {
        console.warn("Unexpected type for structuredContent, treating as null:", typeof data.article.structuredContent);
        data.article.structuredContent = null;
    }
    return data.article as ArticleForEditor;
  } catch (error: any) {
    console.error("Error fetching article for editor:", error);
    toast.error(`Failed to load article: ${error.message}`);
    return null;
  }
}

// 自动保存配置
const AUTO_SAVE_DELAY = 30000; // 30秒
const AUTO_SAVE_ENABLED = true;

function escapeRegExp(string: string): string { 
  return string.replace(/[.*+?^${}()|[\\\]\\]/g, '\\$&'); 
}

export default function ArticleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const articleId = params.articleId as string;
  const { data: session } = useSession();
  const t = useTranslations('articles.editor');
  const tStatus = useTranslations('articles');

  const [article, setArticle] = useState<ArticleForEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [imageControls, setImageControls] = useState<ImageControlData[]>([]);
  const [nextNewImageIndex, setNextNewImageIndex] = useState(1);
  const [imageToView, setImageToView] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 自动保存相关状态
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // TiptapEditor 引用
  const tiptapEditorRef = useRef<TiptapEditorRef>(null);
  const mdEditorContainerRef = useRef<HTMLDivElement>(null);
  const imageListContainerRef = useRef<HTMLDivElement>(null);
  const editorScrollableRef = useRef<HTMLElement | null>(null);
  
  // 标记是否需要特殊处理预处理内容
  const [needsMarkdownProcessing, setNeedsMarkdownProcessing] = useState(false);

  // State for status update feature
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // AI结果Modal相关状态
  const [aiResultModal, setAIResultModal] = useState({
    isOpen: false,
    originalText: '',
    aiSuggestedText: '',
    actionType: '',
    actionLabel: '',
    isLoading: false
  });

  // Content Analyst Modal相关状态
  const [contentAnalystModal, setContentAnalystModal] = useState({
    isOpen: false,
  });

  // 确认弹窗状态
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'warning' | 'danger' | 'info' | 'success';
    children?: React.ReactNode;
  }>({
    isOpen: false,
    title: '',
    onConfirm: () => {}
  });

  const getStatusClass = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'pending_publish':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'published':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'archived':
        return 'bg-gray-100 text-gray-600 border border-gray-300';
      case 'queued':
        return 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border border-blue-300 animate-pulse';
      case 'failed':
      case 'generation_failed':
        return 'bg-red-100 text-red-700 border border-red-300';
      default:
        return 'bg-indigo-100 text-indigo-700 border border-indigo-300';
    }
  };

  // Helper function to format status display consistently with articles listing
  const getStatusDisplayName = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending_publish':
        return tStatus('statusDisplay.pending_publish');
      case 'generation_failed':
        return tStatus('statusDisplay.generation_failed');
      case 'published':
        return tStatus('statusDisplay.published');
      case 'draft':
        return tStatus('statusDisplay.draft');
      case 'archived':
        return tStatus('statusDisplay.archived');
      case 'queued':
        return tStatus('statusDisplay.queued');
      case 'processing':
        return tStatus('statusDisplay.processing');
      default:
        return status.toUpperCase().replace('_', ' ');
    }
  };

  // 同步占位符状态：检测当前内容中哪些占位符还存在
  const syncPlaceholderStatus = useCallback((currentContent?: string) => {
    // 从多个来源获取内容进行检测
    const htmlContent = tiptapEditorRef.current?.getHTML() || '';
    const markdownContent = tiptapEditorRef.current?.getMarkdown() || '';
    const stateContent = currentContent || editedContent;
    
    // Debug logging only when needed
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_PLACEHOLDER === 'true') {
      console.log(`[SyncPlaceholder] Checking content sources:`, {
        htmlLength: htmlContent.length,
        markdownLength: markdownContent.length,
        stateLength: stateContent.length
      });
    }
    
    if (!htmlContent && !markdownContent && !stateContent) return;

    setImageControls(prevControls => {
      // 先检查是否有任何变化，避免不必要的状态更新
      let hasChanges = false;
      const updatedControls = prevControls.map(control => {
        const escapedTag = escapeRegExp(control.placeholderTag);
        const regex = new RegExp(escapedTag);
        
        // 在多个内容源中检查占位符是否存在
        const isPresent = regex.test(htmlContent) || 
                         regex.test(markdownContent) || 
                         regex.test(stateContent);
        
        // 如果control没有isPlaceholderPresent属性，或者状态发生变化，则标记需要更新
        if ((control as any).isPlaceholderPresent !== isPresent) {
          console.log(`[SyncPlaceholder] ${control.placeholderTag} present: ${isPresent} (html:${regex.test(htmlContent)}, md:${regex.test(markdownContent)}, state:${regex.test(stateContent)})`);
          hasChanges = true;
          return {
            ...control,
            isPlaceholderPresent: isPresent
          } as ImageControlData & { isPlaceholderPresent: boolean };
        }
        
        return control;
      });

      // 只有在确实有变化时才返回新数组，否则返回原数组
      return hasChanges ? updatedControls : prevControls;
    });
  }, []); // 移除依赖以避免循环依赖

  // 加载文章数据
  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) {
        toast.error(t('error.missingArticleId'));
        setIsLoading(false);
        setInitialLoadDone(true);
        return;
      }

      setIsLoading(true);
      const currentArticleId = articleId;

      try {
        const fetchedArticle = await fetchArticleForEditor(currentArticleId);
        
        if (!fetchedArticle) {
          toast.error(t('error.loadFailed'));
          setIsLoading(false);
          setInitialLoadDone(true);
          return;
        }

        setArticle(fetchedArticle);
        const currentContent = fetchedArticle.content || "";
          
          // 对内容进行预处理，确保callout语法能正确转换
          let processedContent = currentContent;
          
          // 检查内容是否可能包含markdown callout语法
          if (currentContent.includes('> [!')) {
            console.log("[LoadArticle] Detected potential callout syntax, preprocessing content");
            try {
              processedContent = preprocessMarkdownForTiptap(currentContent);
              console.log("[LoadArticle] Content preprocessed for callouts");
              setNeedsMarkdownProcessing(true); // 标记需要特殊处理
            } catch (error) {
              console.error("[LoadArticle] Error preprocessing markdown:", error);
              processedContent = currentContent; // 回退到原始内容
              setNeedsMarkdownProcessing(false);
            }
          } else {
            setNeedsMarkdownProcessing(false);
          }
          
          setEditedContent(processedContent);
          console.log("[LoadArticle] Fetched content (first 500 chars):", currentContent?.substring(0, 500) + "...");
          console.log("[LoadArticle] Processed content (first 500 chars):", processedContent?.substring(0, 500) + "...");
        console.log("[LoadArticle] Fetched structuredContent:", fetchedArticle.structuredContent);

          const placeholderRegex = /\[(IMAGE_PLACEHOLDER_\d+|NEW_IMAGE_\d+)\]/g;
          const placeholdersInDbContent = Array.from(currentContent.matchAll(placeholderRegex));
          console.log("[LoadArticle] Placeholders found in DB content:", placeholdersInDbContent.map(p => p[0]));

          const controlsFromDb: ImageControlData[] = placeholdersInDbContent.map(matchResult => {
            const placeholderTag = matchResult[0];
            
            // 首先尝试从元数据中恢复完整状态
            const metaKey = `${placeholderTag}_meta`;
          const savedMeta = (fetchedArticle.structuredContent && typeof fetchedArticle.structuredContent === 'object' && fetchedArticle.structuredContent[metaKey])
                           ? fetchedArticle.structuredContent[metaKey]
                             : null;
                             
            if (savedMeta && typeof savedMeta === 'object') {
              // 从保存的元数据中恢复
              return {
                placeholderTag,
                type: savedMeta.type || 'uploaded',
                prompt: savedMeta.prompt,
                status: savedMeta.status || 'idle',
                imageUrl: savedMeta.imageUrl,
                jobId: savedMeta.jobId,
                errorMessage: savedMeta.errorMessage,
              };
            }
            
            // 如果没有元数据，使用旧的逻辑作为回退
          const prompt = (fetchedArticle.structuredContent && typeof fetchedArticle.structuredContent === 'object' && fetchedArticle.structuredContent[placeholderTag])
                         ? String(fetchedArticle.structuredContent[placeholderTag])
                           : '';
          const imageUrlFromDb = (fetchedArticle.structuredContent && typeof fetchedArticle.structuredContent === 'object' && fetchedArticle.structuredContent[`${placeholderTag}_url`])
                                ? String(fetchedArticle.structuredContent[`${placeholderTag}_url`])
                                  : undefined;
          const jobIdFromDb = (fetchedArticle.structuredContent && typeof fetchedArticle.structuredContent === 'object' && fetchedArticle.structuredContent[`${placeholderTag}_jobId`])
                            ? String(fetchedArticle.structuredContent[`${placeholderTag}_jobId`])
                              : undefined;
          const errorMessageFromDb = (fetchedArticle.structuredContent && typeof fetchedArticle.structuredContent === 'object' && fetchedArticle.structuredContent[`${placeholderTag}_error`])
                                   ? String(fetchedArticle.structuredContent[`${placeholderTag}_error`])
                                     : undefined;
            const jobIdFromDbUrl = imageUrlFromDb?.startsWith('/api/images/') ? imageUrlFromDb.split('/').pop() : undefined;
            
            // 判断图片类型的逻辑：
            // 1. IMAGE_PLACEHOLDER_X 系列都是AI生成类型（文章生成时创建）
            // 2. 如果有prompt内容，则是AI生成类型
            // 3. 如果图片URL是AI生成的格式（/api/images/），则是AI生成类型
            // 4. 其他情况为上传类型
            let type: 'ai-generated' | 'uploaded' = 'uploaded';
            if (placeholderTag.includes('IMAGE_PLACEHOLDER_')) {
              // 文章生成时创建的图片占位符，都是AI生成类型
              type = 'ai-generated';
            } else if (prompt && prompt.trim().length > 0) {
              // 有prompt内容的是AI生成类型
              type = 'ai-generated';
            } else if (jobIdFromDbUrl || jobIdFromDb) {
              // 有AI生成的jobId的是AI生成类型
              type = 'ai-generated';
            }
            
            return {
              placeholderTag,
              type,
              prompt: type === 'ai-generated' ? prompt : undefined,
              status: imageUrlFromDb ? 'succeeded' : (errorMessageFromDb ? 'failed' : 'idle'),
              imageUrl: imageUrlFromDb,
              jobId: jobIdFromDb || jobIdFromDbUrl,
              errorMessage: errorMessageFromDb,
            };
          });

          // 从localStorage加载缓存控件并合并
          const cachedControls = loadImageControlsFromLocalStorage(currentArticleId);
          let finalMergedControls: ImageControlData[];

          if (cachedControls) {
            console.log("[LoadArticle] Merging DB controls with cached controls.");
            const mergedControlsMap = new Map<string, ImageControlData>();

            // 先设置数据库中的控件（作为基础）
            controlsFromDb.forEach(ctrl => mergedControlsMap.set(ctrl.placeholderTag, ctrl));
            
            // 然后只合并localStorage中有更新状态的控件
            cachedControls.forEach((cachedCtrl: ImageControlData) => {
              const dbCtrl = mergedControlsMap.get(cachedCtrl.placeholderTag);
              if (dbCtrl) {
                // 智能合并：只有当缓存状态更"新"时才覆盖数据库状态
                // 优先级：loading > failed > succeeded > idle
                // 如果数据库已经有成功状态，但缓存是loading或failed，说明有新的操作
                const shouldUseCached = 
                  (cachedCtrl.status === 'loading') || // 正在处理中的状态优先
                  (cachedCtrl.status === 'failed' && dbCtrl.status !== 'loading') || // 新的失败状态
                  (cachedCtrl.status === 'succeeded' && dbCtrl.status === 'idle') || // 新的成功状态
                  (cachedCtrl.prompt && cachedCtrl.prompt.trim() !== dbCtrl.prompt?.trim()); // prompt有更新
                
                if (shouldUseCached) {
                  console.log(`[LoadArticle] Using cached state for ${cachedCtrl.placeholderTag}: ${cachedCtrl.status}`);
                  mergedControlsMap.set(cachedCtrl.placeholderTag, { 
                    ...dbCtrl,
                    ...cachedCtrl
                  });
                } else {
                  console.log(`[LoadArticle] Keeping DB state for ${cachedCtrl.placeholderTag}: ${dbCtrl.status}`);
                }
              } else {
                // 数据库中没有的控件，直接使用缓存
                mergedControlsMap.set(cachedCtrl.placeholderTag, cachedCtrl);
              }
            });
            finalMergedControls = Array.from(mergedControlsMap.values());
          } else {
            console.log("[LoadArticle] No cached controls in localStorage, using DB based.");
            finalMergedControls = controlsFromDb;
          }
          
          // 按照文章中的顺序排序控件
          const orderedFinalControls: ImageControlData[] = [];
          const finalControlsMapForOrdering = new Map(finalMergedControls.map(c => [c.placeholderTag, c]));

          placeholdersInDbContent.forEach(matchResult => {
            const tag = matchResult[0];
            if (finalControlsMapForOrdering.has(tag)) {
              orderedFinalControls.push(finalControlsMapForOrdering.get(tag)!);
              finalControlsMapForOrdering.delete(tag);
            }
          });
          finalControlsMapForOrdering.forEach(ctrl => orderedFinalControls.push(ctrl));

          // 计算下一个新图片的索引
          let maxExistingIndex = 0;
          orderedFinalControls.forEach(ctrl => {
            const tagContent = ctrl.placeholderTag.substring(1, ctrl.placeholderTag.length - 1);
            const tagNumberPart = tagContent.split('_').pop();
            if (tagNumberPart && !isNaN(parseInt(tagNumberPart))) {
              maxExistingIndex = Math.max(maxExistingIndex, parseInt(tagNumberPart, 10));
            }
          });

          console.log("[LoadArticle] Final mergedControls array to be set:", orderedFinalControls);
          setImageControls(orderedFinalControls);
          setNextNewImageIndex(maxExistingIndex + 1);
          console.log("[LoadArticle] State updated.");

          // 初始化占位符状态
          setTimeout(() => {
            syncPlaceholderStatus(currentContent);
          }, 100);

      } catch (error: any) {
        toast.error(t('error.loadFailed'));
        setImageControls([]);
      } finally {
        setIsLoading(false);
        setInitialLoadDone(true);
      }
    };
    loadArticle();
  }, [params.articleId, articleId, syncPlaceholderStatus]);

  // 保存到localStorage
  useEffect(() => {
    if (articleId && initialLoadDone) { 
      console.log(`[LocalStorage SAVE Trigger] Attempting to save. articleId: ${articleId}, initialLoadDone: ${initialLoadDone}, imageControls count: ${imageControls.length}`);
      saveImageControlsToLocalStorage(articleId, imageControls);
    } else {
      console.log(`[LocalStorage SAVE Trigger] Skipped save. articleId: ${articleId}, initialLoadDone: ${initialLoadDone}`);
    }
  }, [imageControls, articleId, initialLoadDone]);

  // 组件卸载时清理自动保存定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // 页面离开前提示未保存的变化
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // 现代浏览器需要这个
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);



  // 初始化时设置lastSavedContent
  useEffect(() => {
    if (article && article.content && !lastSavedContent) {
      setLastSavedContent(article.content);
    }
  }, [article, lastSavedContent]);

  // 处理预处理内容的特殊设置
  useEffect(() => {
    if (needsMarkdownProcessing && tiptapEditorRef.current && editedContent) {
      console.log("[PostProcess] Setting preprocessed content as HTML to editor");
      // 由于内容已经被预处理为HTML格式，直接设置即可
      setTimeout(() => {
        tiptapEditorRef.current?.setContent(editedContent);
        
        // 在内容设置后，重新同步占位符状态
        setTimeout(() => {
          console.log("[PostProcess] Re-syncing placeholder status after content processing");
          syncPlaceholderStatus();
        }, 300);
      }, 100); // 短暂延迟确保编辑器完全准备好
    }
  }, [needsMarkdownProcessing, editedContent]);

  // 监听编辑器就绪状态，确保占位符检测正确
  useEffect(() => {
    if (initialLoadDone && imageControls.length > 0 && tiptapEditorRef.current) {
      // 延迟检查确保编辑器完全渲染
      const timeoutId = setTimeout(() => {
        console.log("[EditorReady] Performing final placeholder status sync");
        syncPlaceholderStatus();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadDone, imageControls.length, syncPlaceholderStatus]);

  const handleContentChange = (value?: string) => {
    const newContent = value || "";
    setEditedContent(newContent);
    
    // 检查是否有未保存的变化
    if (newContent !== lastSavedContent && initialLoadDone) {
      setHasUnsavedChanges(true);
      
      // 清除之前的自动保存定时器
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // 设置新的自动保存定时器
      if (AUTO_SAVE_ENABLED) {
        autoSaveTimeoutRef.current = setTimeout(() => {
          performAutoSave(newContent);
        }, AUTO_SAVE_DELAY);
      }
    }
    
    // 使用新的内容同步检测占位符状态
    syncPlaceholderStatus(newContent);
  };

  const handlePromptChange = (index: number, newPrompt: string) => {
    setImageControls(prevControls =>
      prevControls.map((ctrl, i) =>
        i === index ? { ...ctrl, prompt: newPrompt } : ctrl
      )
    );
    
    // prompt变化也触发未保存状态
    if (initialLoadDone) {
      setHasUnsavedChanges(true);
      
      // 清除之前的自动保存定时器
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // 设置新的自动保存定时器
      if (AUTO_SAVE_ENABLED) {
        autoSaveTimeoutRef.current = setTimeout(() => {
          const currentContent = tiptapEditorRef.current?.getMarkdown() || editedContent;
          performAutoSave(currentContent);
        }, AUTO_SAVE_DELAY);
      }
    }
  };

  // AI生成图片
  const handleGenerateImage = async (index: number) => {
    const controlToUpdate = imageControls[index];
    if (!controlToUpdate || controlToUpdate.type !== 'ai-generated' || !controlToUpdate.prompt?.trim()) {
      toast.error(t('toast.promptRequired'));
      return;
    }

    // Get teamId from session
    const teamId = session?.user?.teams?.[0]?.id;
    if (!teamId) {
      toast.error(t('toast.teamInfoMissing'));
      setImageControls(prevControls =>
        prevControls.map((ctrl, i) =>
          i === index ? { ...ctrl, status: 'failed' as const, errorMessage: "Team ID missing", imageUrl: undefined, jobId: undefined } : ctrl
        )
      );
      return;
    }

    setImageControls(prevControls =>
      prevControls.map((ctrl, i) =>
        i === index ? { ...ctrl, status: 'loading' as const, errorMessage: undefined, imageUrl: undefined, jobId: undefined } : ctrl
      )
    );
    toast.info(t('toast.generatingImage', { tag: controlToUpdate.placeholderTag }));

    try {
      const payload = {
        prompt: controlToUpdate.prompt,
        placeholderTag: controlToUpdate.placeholderTag,
        articleId: articleId,
        teamId: teamId,
      };
      console.log(`[handleGenerateImage] Calling API for control index ${index} with payload:`, payload);

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('[handleGenerateImage] API Response Details - OK:', response.ok, 'Status Code:', response.status, 'Response Body:', result);

      if (response.ok && result.status === 'succeeded' && result.jobId) {
        const imageUrl = `/api/images/${result.jobId}`;
        console.log(`[handleGenerateImage] Image generation SUCCESS for control index ${index}. Constructed URL: ${imageUrl}, Job ID: ${result.jobId}`);
        
        setImageControls(prevControls => {
          const newControls = prevControls.map((ctrl, i) => {
            if (i === index) {
              return { 
                ...ctrl, 
                status: 'succeeded' as const, 
                imageUrl: imageUrl, 
                jobId: result.jobId, 
                errorMessage: undefined 
              };
            }
            return ctrl;
          });

          if (articleId && initialLoadDone) {
            console.log("[handleGenerateImage] Saving to localStorage post-success state update.");
            saveImageControlsToLocalStorage(articleId, newControls);
          }
          return newControls;
        });

        toast.success(t('toast.imageGenerateSuccess', { tag: controlToUpdate.placeholderTag }));
      } else {
        let errorMsg = "Image generation process reported an issue.";
        if (result.error) {
           errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
        } else if (result.message) {
           errorMsg = typeof result.message === 'string' ? result.message : JSON.stringify(result.message);
        } else if (!response.ok) {
            errorMsg = `HTTP error ${response.status}: ${response.statusText}`;
        } else if (result.status !== 'succeeded'){
           errorMsg = `API indicated not 'succeeded'. Actual status: ${result.status}`;
        } else if (!result.jobId){
            errorMsg = "API succeeded but missing jobId";
        }

        console.error(`[handleGenerateImage] Image generation ERROR for control index ${index}: ${errorMsg}`);
        setImageControls(prevControls =>
          prevControls.map((ctrl, i) =>
            i === index ? { ...ctrl, status: 'failed' as const, errorMessage: errorMsg, imageUrl: undefined, jobId: undefined } : ctrl
          )
        );
        toast.error(t('toast.imageGenerateFailed', { error: errorMsg }));
      }
    } catch (error: any) {
      console.error(`[handleGenerateImage] Image generation EXCEPTION for control index ${index}:`, error);
      const errorMsg = error.message || "Network error occurred";
      setImageControls(prevControls =>
        prevControls.map((ctrl, i) =>
          i === index ? { ...ctrl, status: 'failed' as const, errorMessage: errorMsg, imageUrl: undefined, jobId: undefined } : ctrl
        )
      );
      toast.error(t('toast.imageGenerateFailed', { error: errorMsg }));
    }
  };

  // 上传本地图片
  const handleUploadImage = async (index: number, file: File) => {
    const controlToUpdate = imageControls[index];
    if (!controlToUpdate || controlToUpdate.type !== 'uploaded') {
      toast.error(t('toast.invalidImageControl'));
      return;
    }

    setImageControls(prevControls =>
      prevControls.map((ctrl, i) =>
        i === index ? { ...ctrl, status: 'loading' as const, errorMessage: undefined, imageUrl: undefined } : ctrl
      )
    );
    toast.info(t('toast.uploadingImage', { tag: controlToUpdate.placeholderTag }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('articleId', articleId);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('[handleUploadImage] Upload API Response:', result);

      if (response.ok && result.success && result.imageUrl) {
        setImageControls(prevControls => {
          const newControls = prevControls.map((ctrl, i) => {
            if (i === index) {
              return { 
                ...ctrl, 
                status: 'succeeded' as const, 
                imageUrl: result.imageUrl,
                uploadedFile: file,
                errorMessage: undefined 
              };
            }
            return ctrl;
          });

          if (articleId && initialLoadDone) {
            saveImageControlsToLocalStorage(articleId, newControls);
          }
          return newControls;
        });

        toast.success(t('toast.imageUploadSuccess', { tag: controlToUpdate.placeholderTag }));
      } else {
        const errorMsg = result.error || "Upload failed";
        console.error(`[handleUploadImage] Upload ERROR: ${errorMsg}`);
        setImageControls(prevControls =>
          prevControls.map((ctrl, i) =>
            i === index ? { ...ctrl, status: 'failed' as const, errorMessage: errorMsg, imageUrl: undefined } : ctrl
          )
        );
        toast.error(t('toast.imageUploadFailed', { error: errorMsg }));
      }
    } catch (error: any) {
      console.error(`[handleUploadImage] Upload EXCEPTION:`, error);
      const errorMsg = error.message || "Network error occurred";
      setImageControls(prevControls =>
        prevControls.map((ctrl, i) =>
          i === index ? { ...ctrl, status: 'failed' as const, errorMessage: errorMsg, imageUrl: undefined } : ctrl
        )
      );
      toast.error(t('toast.imageUploadFailed', { error: errorMsg }));
    }
  };

  // 优化后的图片插入函数 - 使用新的编辑器API
  const handleInsertImageMarkdown = (index: number) => {
    const control = imageControls[index];
    if (!control || control.status !== 'succeeded' || !control.imageUrl) {
      toast.error(t('toast.imageNotReady'));
      return;
    }

    console.log(`[InsertImage] Starting insertion for ${control.placeholderTag}`);

    // 构建图片HTML（使用HTML而不是markdown以确保预览）
    const absoluteImageUrl = control.imageUrl.startsWith('http') 
      ? control.imageUrl 
      : `${window.location.origin}${control.imageUrl}`;
    
    // 使用HTML格式而不是markdown，确保图片能正确显示
    const imageHTML = `<img src="${absoluteImageUrl}" alt="Generated image for ${control.placeholderTag}" class="tiptap-image" style="max-width: 100%; height: auto;" />`;
    
    console.log(`[InsertImage] Image HTML to insert:`, imageHTML);
    
    // 检查占位符是否存在
    const placeholderExists = tiptapEditorRef.current?.containsText(control.placeholderTag);
    
    if (placeholderExists) {
      console.log(`[InsertImage] Placeholder found, attempting replacement`);
      
      // 使用编辑器的replaceText方法进行替换
      const replaceSuccess = tiptapEditorRef.current?.replaceText(control.placeholderTag, imageHTML);
      
      if (replaceSuccess) {
        console.log(`[InsertImage] Successfully replaced placeholder`);
        
        // 强制编辑器重新渲染以确保图片显示
        setTimeout(() => {
          if (tiptapEditorRef.current?.editor) {
            tiptapEditorRef.current.editor.view.updateState(tiptapEditorRef.current.editor.state);
          }
        }, 100);
        
        // 同步状态
        const updatedContent = tiptapEditorRef.current?.getMarkdown() || '';
        setEditedContent(updatedContent);
        
        toast.success(t('toast.imageInsertSuccess'));
        
        // 立即同步占位符状态
        setTimeout(() => syncPlaceholderStatus(), 200);
        
      } else {
        console.error(`[InsertImage] Failed to replace placeholder using editor API`);
        toast.error(t('toast.couldNotReplaceplaceholder'));
      }
      
    } else {
      console.warn(`[InsertImage] Placeholder ${control.placeholderTag} not found in content`);
      
      // Provide smart handling options - use custom dialog
      setConfirmDialog({
        isOpen: true,
        title: t('insertImageDialog.placeholderNotFound'),
        variant: 'warning',
        confirmText: t('insertImageDialog.insertAtCursor'),
        cancelText: t('insertImageDialog.copyToClipboard'),
        children: (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              {t('insertImageDialog.placeholderNotFoundDesc', { tag: control.placeholderTag })}
            </p>
            <p className="text-sm text-gray-600">
              {t('insertImageDialog.editedContentNote')}
            </p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">{t('insertImageDialog.chooseHowToHandle')}</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>{t('insertImageDialog.insertAtCursor')}</strong>: {t('insertImageDialog.insertAtCursorDesc')}</li>
                <li>• <strong>{t('insertImageDialog.copyToClipboard')}</strong>: {t('insertImageDialog.copyToClipboardDesc')}</li>
              </ul>
            </div>
          </div>
        ),
        onConfirm: () => {
          // Insert image at cursor position
          try {
            tiptapEditorRef.current?.insertContent(imageHTML);
            
            // Force re-render
            setTimeout(() => {
              if (tiptapEditorRef.current?.editor) {
                tiptapEditorRef.current.editor.view.updateState(tiptapEditorRef.current.editor.state);
              }
            }, 100);
            
            // Update state
            const newContent = tiptapEditorRef.current?.getMarkdown() || '';
            setEditedContent(newContent);
            
            toast.success(t('toast.imageInsertedAtCursor'));
            
            // Sync placeholder status
            setTimeout(() => syncPlaceholderStatus(), 200);
            
          } catch (error: any) {
            console.error(`[InsertImage] Failed to insert at cursor:`, error);
            toast.error(t('toast.failedToInsertImage', { error: error.message }));
          }
        },
        onCancel: () => {
          // Copy to clipboard
          try {
            navigator.clipboard.writeText(imageHTML);
            toast.success(t('toast.imageHtmlCopiedToClipboard'));
          } catch (error: any) {
            console.error(`[InsertImage] Clipboard copy failed:`, error);
            // Show HTML for manual copy
            setConfirmDialog({
              isOpen: true,
              title: t('insertImageDialog.manualCopyHtml'),
              variant: 'info',
              confirmText: t('insertImageDialog.iveCopied'),
              cancelText: t('insertImageDialog.close'),
              children: (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    {t('insertImageDialog.unableToCopyToClipboard')}
                  </p>
                  <div className="bg-gray-100 p-3 rounded border">
                    <code className="text-xs break-all select-all">{imageHTML}</code>
                  </div>
                </div>
              ),
              onConfirm: () => {}
            });
          }
        }
      });
    }
  };

  // 添加新图片（支持AI生成和上传两种模式）
  const handleAddNewImage = (type: 'ai-generated' | 'uploaded' = 'ai-generated') => {
    const newTag = `[NEW_IMAGE_${nextNewImageIndex}]`;
    const newControl: ImageControlData = {
      placeholderTag: newTag,
      type,
      prompt: type === 'ai-generated' ? '' : undefined,
      status: 'idle',
      errorMessage: undefined,
      imageUrl: undefined,
      jobId: undefined,
    };
    setImageControls(prevControls => [...prevControls, newControl]);
    setNextNewImageIndex(prevIndex => prevIndex + 1);
    setEditedContent(prevContent => `${prevContent}\n\n${newTag}\n`);
    const typeLabel = type === 'ai-generated' ? t('imageControl.aiType') : t('imageControl.uploadType');
    toast.info(t('toast.addedNewPlaceholder', { type: typeLabel, tag: newTag }));
    
    // 添加滚动到新图片的逻辑
    setTimeout(() => {
      if (imageListContainerRef.current) {
        // 滚动到容器底部
        imageListContainerRef.current.scrollTo({
          top: imageListContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100); // 延迟确保DOM更新完成
  };

  // 自动保存逻辑
  const performAutoSave = useCallback(async (content: string) => {
    if (!article || !content.trim() || content === lastSavedContent || isAutoSaving || isSaving) {
      return;
    }

    console.log('[AutoSave] Starting auto save...');
    setIsAutoSaving(true);

    try {
      const newStructuredContent: Record<string, any> = {};
      
      // 保存所有imageControls的完整状态
      imageControls.forEach(ctrl => {
        const controlData: any = {
          type: ctrl.type,
          status: ctrl.status,
        };
        
        if (ctrl.prompt?.trim()) {
          controlData.prompt = ctrl.prompt;
          newStructuredContent[ctrl.placeholderTag] = ctrl.prompt;
        }
        
        if (ctrl.imageUrl) {
          controlData.imageUrl = ctrl.imageUrl;
          newStructuredContent[`${ctrl.placeholderTag}_url`] = ctrl.imageUrl;
        }
        
        if (ctrl.jobId) {
          controlData.jobId = ctrl.jobId;
          newStructuredContent[`${ctrl.placeholderTag}_jobId`] = ctrl.jobId;
        }
        
        if (ctrl.errorMessage) {
          controlData.errorMessage = ctrl.errorMessage;
          newStructuredContent[`${ctrl.placeholderTag}_error`] = ctrl.errorMessage;
        }
        
        newStructuredContent[`${ctrl.placeholderTag}_meta`] = controlData;
      });

      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content,
          structuredContent: newStructuredContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedArticle = result.article;
        setArticle(prevArticle => prevArticle ? { ...prevArticle, ...updatedArticle } : updatedArticle);
        setLastSavedContent(content);
        setHasUnsavedChanges(false);
        setLastAutoSaveTime(new Date());
        
        // 更新localStorage
        if (articleId && initialLoadDone) {
          saveImageControlsToLocalStorage(articleId, imageControls);
        }
        
        console.log('[AutoSave] Auto save successful');
        // 可选：显示一个简短的成功提示
        // toast.success(t('toast.autoSaveSuccess'), { duration: 2000 });
      } else {
        console.error('[AutoSave] Auto save failed:', response.status);
        // 自动保存失败时不显示错误提示，避免打扰用户
      }
    } catch (error: any) {
      console.error('[AutoSave] Auto save error:', error);
      // 自动保存失败时不显示错误提示
    } finally {
      setIsAutoSaving(false);
    }
  }, [article, lastSavedContent, isAutoSaving, isSaving, imageControls, articleId, initialLoadDone]);

  // 手动保存逻辑
  const handleSave = async () => {
    if (!article || !editedContent.trim()) {
      toast.error(t('toast.contentRequired'));
      return;
    }

    // 检查是否有正在进行的图片生成
    const loadingImages = imageControls.filter(ctrl => ctrl.status === 'loading');
    if (loadingImages.length > 0) {
      const loadingTags = loadingImages.map(ctrl => ctrl.placeholderTag).join(', ');
      console.log('[Save] Warning: Images still generating:', loadingTags);
      toast.warning(t('toast.imagesStillGenerating', { 
        count: loadingImages.length,
        tags: loadingTags
      }));
      // 继续保存，但给出警告
    }

    // 确保使用最新的编辑器内容
    const currentMarkdown = tiptapEditorRef.current?.getMarkdown() || editedContent;
    console.log('[Save] Saving content:', {
      editedContentLength: editedContent.length,
      currentMarkdownLength: currentMarkdown.length,
      areSame: editedContent === currentMarkdown,
      imageControlsCount: imageControls.length,
      loadingImagesCount: loadingImages.length
    });

    setIsSaving(true);
    try {
    const newStructuredContent: Record<string, any> = {};
    
    // 保存所有imageControls的完整状态，而不只是有prompt的和已成功的
    imageControls.forEach(ctrl => {
      // 保存每个控件的完整状态信息
      const controlData: any = {
        type: ctrl.type,
        status: ctrl.status,
      };
      
      // 如果有prompt，保存prompt
      if (ctrl.prompt?.trim()) {
        controlData.prompt = ctrl.prompt;
        newStructuredContent[ctrl.placeholderTag] = ctrl.prompt;
      }
      
      // 如果有图片URL，保存URL
      if (ctrl.imageUrl) {
        controlData.imageUrl = ctrl.imageUrl;
        newStructuredContent[`${ctrl.placeholderTag}_url`] = ctrl.imageUrl;
      }
      
      // 如果有jobId，保存jobId
      if (ctrl.jobId) {
        controlData.jobId = ctrl.jobId;
        newStructuredContent[`${ctrl.placeholderTag}_jobId`] = ctrl.jobId;
      }
      
      // 如果有错误信息，保存错误信息
      if (ctrl.errorMessage) {
        controlData.errorMessage = ctrl.errorMessage;
        newStructuredContent[`${ctrl.placeholderTag}_error`] = ctrl.errorMessage;
      }
      
      // 保存控件的完整状态
      newStructuredContent[`${ctrl.placeholderTag}_meta`] = controlData;
    });

    // 使用当前编辑器的实际内容，而不是状态中的内容（可能滞后）
    const updatedContentOnSave = currentMarkdown;

      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: updatedContentOnSave,
            structuredContent: newStructuredContent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // API返回的结构是 { article: updatedArticle }，需要取出article字段
        const updatedArticle = result.article;
        // 保持其他字段不变，只更新返回的字段
        setArticle(prevArticle => prevArticle ? { ...prevArticle, ...updatedArticle } : updatedArticle);
        setEditedContent(updatedContentOnSave);
        
        // 保存成功后，更新localStorage中的状态，确保与数据库同步
        if (articleId && initialLoadDone) {
          console.log('[Save] Updating localStorage after successful DB save');
          saveImageControlsToLocalStorage(articleId, imageControls);
        }
        
        // 更新保存状态
        setLastSavedContent(updatedContentOnSave);
        setHasUnsavedChanges(false);
        setLastAutoSaveTime(new Date());
        
        toast.success(t('toast.saveSuccess'));
      } else {
        const errorData = await response.json();
        toast.error(t('toast.saveFailed', { error: errorData.error || 'Unknown error' }));
      }
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error(t('toast.saveFailed', { error: error.message || 'Network error' }));
    } finally {
        setIsSaving(false);
    }
  };

  // 键盘快捷键：Ctrl+S / Cmd+S 保存
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!isSaving && !isAutoSaving && article) {
          handleSave();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSaving, isAutoSaving, article]);

  const handleUpdateArticleStatus = async (newStatus: string) => {
    if (!article) return toast.error("Article data not loaded.");
    if (article.status === newStatus) {
      toast.info(`Article is already in '${newStatus}' state.`);
      return;
    }

    setIsUpdatingStatus(true);
    toast.info(`Updating article status to '${newStatus}'...`);

    try {
      const response = await fetch(`/api/articles/${article.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || `Failed to update status (HTTP ${response.status})`;
        let details = result.details || "No additional details.";
        if (typeof details !== 'string') details = JSON.stringify(details);
        console.error("Update status API error:", errorMsg, "Details:", details);
        let fullErrorMessage = errorMsg;
        if (details !== "No additional details.") {
          fullErrorMessage += ` (${String(details).substring(0, 100)}...)`;
        }
        throw new Error(fullErrorMessage);
      }

      if (result.article && result.article.status === newStatus) {
        setArticle(prevArticle => prevArticle ? { ...prevArticle, status: newStatus } : null);
        toast.success(t('toast.statusUpdateSuccess', { status: newStatus }));
      } else {
        console.error("Update status API returned unexpected result:", result);
        throw new Error("Status update service returned an unexpected result.");
      }

    } catch (error: any) {
      console.error("Error updating article status:", error);
      toast.error(t('toast.statusUpdateFailed', { error: error.message || 'Network error' }));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 处理AI工具栏操作
  const handleAIToolbarAction = async (action: string, selectedText?: string, customPrompt?: string) => {
    console.log('[handleAIToolbarAction] Called with:', { action, selectedText, customPrompt });

    if (!selectedText && !editedContent) {
      toast.error(t('aiToolbar.noContentToProcess'));
      return;
    }

    // 根据action和customPrompt确定actionLabel和prompt
    let prompt = '';
    let actionLabel = '';

    if (action === 'custom' && customPrompt) {
      // 自定义prompt情况
      prompt = customPrompt;
      actionLabel = t('aiToolbar.customAiRequest');
    } else if (action === 'translate' && customPrompt) {
      // 翻译情况，customPrompt是翻译目标语言
      prompt = `Please ${customPrompt.toLowerCase()}: ${selectedText || editedContent}`;
      actionLabel = customPrompt;
    } else if (action === 'shorter' || action === 'longer') {
      // 长度调整情况，customPrompt是具体的指令
      prompt = customPrompt || (selectedText ? `Please ${action === 'shorter' ? 'shorten' : 'expand'} the following text: ${selectedText}` : `Please ${action === 'shorter' ? 'shorten' : 'expand'} the content`);
      actionLabel = action === 'shorter' ? t('aiActions.shorter') : t('aiActions.longer');
    } else {
      // 使用预设操作的prompt
      switch (action) {
        case 'improve':
          prompt = selectedText 
            ? `Please improve the writing quality of the following text to make it clearer and more persuasive:\n\n${selectedText}` 
            : 'Please improve the writing quality of the current content to make it clearer and more persuasive';
          actionLabel = t('aiActions.improve');
          break;
        case 'grammar':
          prompt = selectedText 
            ? `Please check and correct spelling and grammar errors in the following text:\n\n${selectedText}` 
            : 'Please check and correct spelling and grammar errors in the current content';
          actionLabel = t('aiActions.grammar');
          break;
        case 'summarize':
          prompt = selectedText 
            ? `Please summarize the following text:\n\n${selectedText}` 
            : 'Please summarize the current content';
          actionLabel = t('aiActions.summarize');
          break;
        default:
          prompt = selectedText || editedContent;
          actionLabel = t('aiToolbar.aiProcessing');
      }
    }

    // 设置加载状态并打开Modal，立即设置正确的actionLabel
    setAIResultModal(prev => ({
      ...prev,
      isOpen: true,
      isLoading: true,
      originalText: selectedText || editedContent,
      aiSuggestedText: '',
      actionType: action,
      actionLabel: actionLabel, // 直接设置正确的actionLabel
    }));

    console.log('[AI Toolbar Action] Request parameters:', {
      action,
      selectedText: selectedText?.substring(0, 100) + '...',
      prompt: prompt.substring(0, 100) + '...',
      actionLabel
    });

    // 构建请求参数
    const requestBody = {
      user_query: prompt,
      selected_text: selectedText || null,
      full_article_context: editedContent || null,
      // 可以添加更多上下文信息
      style_profile: article?.styleProfile || null,
      target_audience: article?.targetAudienceNames?.join(', ') || null,
      writing_purpose: article?.writingPurpose || null,
    };

    console.log('[AI Toolbar Action] Calling API with:', requestBody);

    try {
      const polishResponse = await fetch('/api/articles/polish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!polishResponse.ok) {
        throw new Error(`AI processing failed: ${polishResponse.status}`);
      }

      const result = await polishResponse.json();
      console.log('[AI Toolbar Action] API Response:', result);
      
      // 根据API返回的数据结构提取内容
      let aiSuggestedText = '';
      
      if (result.status === 'success' && result.data?.suggested_content) {
        aiSuggestedText = result.data.suggested_content;
      } else if (result.data?.suggested_content) {
        aiSuggestedText = result.data.suggested_content;
      } else if (result.polishedContent) {
        aiSuggestedText = result.polishedContent;
      } else if (result.content) {
        aiSuggestedText = result.content;
      } else {
        throw new Error('AI returned data format error');
      }

      console.log('[AI Toolbar Action] Extracted AI suggested text:', aiSuggestedText?.substring(0, 200) + '...');

      // 更新Modal状态
      setAIResultModal(prev => ({
        ...prev,
        isLoading: false,
        aiSuggestedText,
        actionLabel,
      }));

      toast.success(t('aiToolbar.aiProcessingCompleted'));

    } catch (error: any) {
      console.error('[AI Toolbar Action] Error:', error);
      setAIResultModal(prev => ({
        ...prev,
        isLoading: false,
      }));
      toast.error(t('toast.aiActionFailed', { error: error.message }));
    }
  };

  // 处理继续聊天优化
  const handleContinueChat = async (message: string, currentText: string): Promise<string> => {
    console.log('[handleContinueChat] Called with:', { message, currentText: currentText.substring(0, 100) + '...' });

    try {
      const requestBody = {
        user_query: message,
        selected_text: currentText,
        full_article_context: editedContent || null,
        style_profile: article?.styleProfile || null,
        target_audience: article?.targetAudienceNames?.join(', ') || null,
        writing_purpose: article?.writingPurpose || null,
      };

      const chatResponse = await fetch('/api/articles/polish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!chatResponse.ok) {
        throw new Error(`AI processing failed: ${chatResponse.status}`);
      }

      const result = await chatResponse.json();
      
      // 提取AI回复内容
      let aiResponse = '';
      if (result.status === 'success' && result.data?.suggested_content) {
        aiResponse = result.data.suggested_content;
      } else if (result.data?.suggested_content) {
        aiResponse = result.data.suggested_content;
      } else if (result.polishedContent) {
        aiResponse = result.polishedContent;
      } else if (result.content) {
        aiResponse = result.content;
      } else {
        throw new Error('AI returned data format error');
      }

      return aiResponse;
    } catch (error: any) {
      console.error('[handleContinueChat] Error:', error);
      throw error;
    }
  };

  if (isLoading && !article && !initialLoadDone) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">{t('loading.article')}</p>
        </div>
      </div>
    );
  }
  if (!article && initialLoadDone) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-500 mb-4">{t('error.loadFailed')}</p>
        <Button onClick={() => router.push('/articles')}>{t('navigation.backToArticles')}</Button>
      </div>
    );
  }
  if (!article) {
      return <div className="flex justify-center items-center h-screen bg-gray-100"><p className="text-lg text-red-600">{t('error.displayError')}</p></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] bg-gray-100 overflow-hidden">
      <Toaster richColors position="top-center" />
      
      {/* Compact header with essential controls */}
      <div className="bg-white shadow-sm p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={() => router.push('/articles')} className="mr-3">
              &larr; {t('navigation.backToArticles')}
            </Button>
            <h1 className="text-lg font-medium text-gray-800 truncate" title={article?.title || t('navigation.untitledArticle')}>
              {article?.title || t('navigation.untitledArticle')}
            </h1>
            {article?.status && (
              <span className={`ml-3 px-3 py-1 text-xs leading-5 font-semibold rounded-full whitespace-nowrap inline-flex ${getStatusClass(article.status.toLowerCase())}`}>
                {getStatusDisplayName(article.status)}
              </span>
            )}
            {/* Content Analyst 信息图标 */}
            {article?.contentAnalyst && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setContentAnalystModal({ isOpen: true })}
                className="ml-2 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200 hover:border-purple-300 flex items-center gap-2"
                title={t('toolbar.viewAnalysis')}
              >
                <Brain size={16} />
                <span className="text-sm font-medium">{t('toolbar.generateLogs')}</span>
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* 自动保存状态指示器 - 移到保存按钮左侧 */}
            <div className="flex items-center text-xs text-gray-500 min-w-[120px]">
              {isAutoSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  <span>{t('toolbar.autoSaving')}</span>
                </div>
              ) : hasUnsavedChanges ? (
                <div className="flex items-center text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  <span>{t('toolbar.unsavedChanges')}</span>
                </div>
              ) : lastAutoSaveTime ? (
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>{t('toolbar.autoSaved')}: {lastAutoSaveTime.toLocaleTimeString()}</span>
                </div>
              ) : null}
            </div>
            
            <Button onClick={handleSave} disabled={isSaving || isLoading || isUpdatingStatus || isAutoSaving} size="sm" className="flex items-center">
              <Save size={16} className="mr-2" /> {t('toolbar.save')}
            </Button>
            
            {article?.status !== "pending_publish" && (
                <Button onClick={() => handleUpdateArticleStatus("pending_publish")} disabled={isUpdatingStatus} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 text-green-700 flex items-center">
                    <Send size={16} className="mr-2" /> {isUpdatingStatus ? t('toolbar.publishing') : t('toolbar.publish')}
                </Button>
            )}
             {article?.status === "pending_publish" && (
                <Button onClick={() => handleUpdateArticleStatus('draft')} disabled={isUpdatingStatus} variant="outline" size="sm" className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 flex items-center">
                    <Undo2 size={16} className="mr-2" /> {isUpdatingStatus ? t('toolbar.publishing') : t('toolbar.toDraft')}
                </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 p-4 space-x-4 overflow-hidden"> 
        
        <div className="flex-grow flex flex-col bg-white shadow rounded-lg overflow-hidden min-w-0">
          <div className="flex-grow relative min-h-0" ref={mdEditorContainerRef}>
            <div className="absolute inset-0 flex flex-col"> 
              <TiptapEditor
                ref={tiptapEditorRef}
                value={editedContent}
                onChange={(html, markdown) => handleContentChange(markdown)}
                height="100%"
                placeholder={t('content.placeholder')}
                className="h-full flex flex-col"
                editorClassName="flex-1 min-h-0 overflow-auto"
                onAIAction={handleAIToolbarAction}
              />
            </div>
          </div>
        </div>

        <div className="w-96 flex-shrink-0 bg-white p-4 rounded-lg shadow flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-3 pb-2 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-700">{t('imageManagement.title')}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" disabled={isLoading || isUpdatingStatus} className="flex items-center">
                  <ImagePlus size={16} className="mr-2" />
                  {t('imageManagement.addImage')}
                  <ChevronDown size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleAddNewImage('ai-generated')} className="flex items-center cursor-pointer">
                  <Sparkles size={16} className="mr-2 text-purple-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{t('imageManagement.aiGenerate')}</span>
                    <span className="text-xs text-gray-500">{t('imageManagement.aiGenerateDesc')}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNewImage('uploaded')} className="flex items-center cursor-pointer">
                  <Upload size={16} className="mr-2 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="font-medium">{t('imageManagement.uploadImage')}</span>
                    <span className="text-xs text-gray-500">{t('imageManagement.uploadImageDesc')}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-3 overflow-y-auto flex-grow" ref={imageListContainerRef}>
            {imageControls.length > 0 ? (
              imageControls.map((ctrl, index) => (
                <ImageControlCard 
                  key={ctrl.placeholderTag || index} 
                  control={ctrl} 
                  index={index}
                  onPromptChange={handlePromptChange}
                  onGenerateImage={handleGenerateImage}
                  onUploadImage={handleUploadImage}
                  onInsertImage={handleInsertImageMarkdown}
                  onViewImage={setImageToView}
                  disabled={isUpdatingStatus}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                 {initialLoadDone ? t('imageManagement.noPlaceholders') : t('imageManagement.loadingControls')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal to view the full-size generated image */}
      {imageToView && (
        <Dialog open={!!imageToView} onOpenChange={() => setImageToView(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-4">
            <DialogHeader>
              <DialogTitle>{t('imageManagement.imagePreview')}</DialogTitle>
            </DialogHeader>
            <div className="flex-grow flex items-center justify-center mt-2 overflow-auto">
              <img src={imageToView} alt="Generated image preview" className="max-w-full max-h-full object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AI结果预览Modal */}
      <AIResultModal
        isOpen={aiResultModal.isOpen}
        onClose={() => setAIResultModal(prev => ({
          ...prev,
          isOpen: false,
          isLoading: false
        }))}
        originalText={aiResultModal.originalText}
        aiSuggestedText={aiResultModal.aiSuggestedText}
        actionType={aiResultModal.actionType}
        actionLabel={aiResultModal.actionLabel}
        onAccept={(finalText: string) => {
          console.log('[AI result accepted] Processing text replacement:', {
            originalText: aiResultModal.originalText.substring(0, 100) + '...',
            finalText: finalText.substring(0, 100) + '...',
            isSelectedText: aiResultModal.originalText !== editedContent
          });

          // 检查是否为选中文本的替换还是整体内容的替换
          const isSelectedTextReplacement = aiResultModal.originalText !== editedContent;
          
          if (isSelectedTextReplacement) {
            // 选中文本替换：在当前内容中找到原文并替换
            let replacementSuccess = false;
            const originalText = aiResultModal.originalText.trim();
            
            console.log('[AI Accept] Starting text replacement', {
              originalText: originalText.substring(0, 100) + '...',
              finalText: finalText.substring(0, 100) + '...',
              currentEditedContent: editedContent.substring(0, 100) + '...'
            });
            
            // 方法1: 尝试在HTML内容中直接替换
            const currentHTML = tiptapEditorRef.current?.getHTML() || '';
            if (currentHTML.includes(originalText)) {
              console.log('[AI Accept] Method 1: Found in HTML, replacing...');
              const updatedContent = currentHTML.replace(originalText, finalText);
              tiptapEditorRef.current?.setContent(updatedContent);
              
              toast.success(t('aiResultModal.toast.textReplaced'));
              replacementSuccess = true;
            }
            
            // 方法2: 如果HTML替换失败，尝试在Markdown内容中替换
            if (!replacementSuccess) {
              const currentMarkdown = tiptapEditorRef.current?.getMarkdown() || editedContent;
              if (currentMarkdown.includes(originalText)) {
                console.log('[AI Accept] Method 2: Found in Markdown, replacing...');
                const updatedMarkdown = currentMarkdown.replace(originalText, finalText);
                tiptapEditorRef.current?.setMarkdownContent(updatedMarkdown);
                
                toast.success(t('aiResultModal.toast.textReplaced'));
                replacementSuccess = true;
              }
            }
            
            // 方法3: 如果精确匹配失败，尝试去除格式后的文本匹配
            if (!replacementSuccess) {
              const currentPlainText = currentHTML.replace(/<[^>]*>/g, '').trim();
              const originalPlainText = originalText.replace(/<[^>]*>/g, '').trim();
              
              if (currentPlainText.includes(originalPlainText)) {
                // 找到了纯文本匹配，尝试智能替换
                const updatedPlainText = currentPlainText.replace(originalPlainText, finalText);
                tiptapEditorRef.current?.setContent(updatedPlainText);
                handleContentChange(tiptapEditorRef.current?.getMarkdown() || updatedPlainText);
                toast.success(t('aiResultModal.toast.textReplaced'));
                replacementSuccess = true;
              }
            }
            
            // 方法4: 最后尝试：直接插入新内容到当前光标位置
            if (!replacementSuccess) {
              console.warn('[AI Accept] Could not find original text for replacement, inserting at cursor');
              tiptapEditorRef.current?.insertContent('\n\n' + finalText + '\n\n');
              toast.success(t('aiResultModal.toast.textInsertedAtCursor'));
            }
          } else {
            // 整体内容替换
            console.log('[AI Accept] Whole content replacement');
            tiptapEditorRef.current?.setContent(finalText);
            
            toast.success(t('aiResultModal.toast.contentReplaced'));
          }

          setAIResultModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        }}
        onReject={() => {
          // 简单的拒绝实现
          console.log('AI result rejected');
          setAIResultModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
        }}
        isLoading={aiResultModal.isLoading}
        onContinueChat={handleContinueChat}
      />

      {/* Content Analyst Modal */}
      {article?.contentAnalyst && (
        <Dialog open={contentAnalystModal.isOpen} onOpenChange={(open) => setContentAnalystModal({ isOpen: open })}>
          <DialogContent className="!max-w-[70vw] !w-[70vw] max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain size={20} className="text-purple-600" />
                {t('toolbar.viewAnalysis')}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-grow overflow-auto p-6 bg-gray-50 rounded-lg">
              <div className="prose prose-base max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded">
                <MarkdownRenderer 
                  content={article.contentAnalyst}
                  className="text-gray-700 leading-relaxed"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setContentAnalystModal({ isOpen: false })}
              >
                {t('content.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 自定义确认弹窗 */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
      >
        {confirmDialog.children}
      </ConfirmDialog>
    </div>
  );
}

// 图片控制卡片组件
interface ImageControlCardProps {
  control: ImageControlData;
  index: number;
  onPromptChange: (index: number, prompt: string) => void;
  onGenerateImage: (index: number) => void;
  onUploadImage: (index: number, file: File) => void;
  onInsertImage: (index: number) => void;
  onViewImage: (url: string) => void;
  disabled: boolean;
}

const ImageControlCard: React.FC<ImageControlCardProps> = ({ 
  control, 
  index, 
  onPromptChange, 
  onGenerateImage, 
  onUploadImage, 
  onInsertImage, 
  onViewImage, 
  disabled 
}) => {
  const t = useTranslations('articles.editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(index, file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`p-3 border rounded-md text-sm ${
      (control as any).isPlaceholderPresent === false 
        ? 'border-amber-200 bg-amber-50/30' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Label className="font-medium text-gray-600">{control.placeholderTag}</Label>
        </div>
        <div className="flex items-center gap-2">
          {(control as any).isPlaceholderPresent === false ? (
            <span className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1" title={t('imageControl.missingTooltip')}>
              <span className="text-amber-500">⚠️</span>
              <span>{t('imageControl.missing')} ({control.type === 'ai-generated' ? t('imageControl.aiType') : t('imageControl.uploadType')})</span>
            </span>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
              control.type === 'ai-generated' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {control.type === 'ai-generated' ? (
                <>
                  <Sparkles size={12} />
                  <span>{t('imageControl.aiType')}</span>
                </>
              ) : (
                <>
                  <Upload size={12} />
                  <span>{t('imageControl.uploadType')}</span>
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {control.type === 'ai-generated' && (
        <Textarea
          value={control.prompt || ''}
          onChange={(e) => onPromptChange(index, e.target.value)}
          placeholder={t('imageControl.promptPlaceholder', { tag: control.placeholderTag })}
          className="my-1.5 h-28 text-xs w-full"
          disabled={control.status === 'loading' || disabled}
        />
      )}

      {control.type === 'uploaded' && (
        <div className="my-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={control.status === 'loading' || disabled}
          />
          <Button
            onClick={triggerFileSelect}
            variant="outline"
            size="sm"
            disabled={control.status === 'loading' || disabled}
            className="w-full flex items-center justify-center"
          >
            <FileImage size={16} className="mr-2" />
            {control.uploadedFile ? t('imageControl.replaceFile', { filename: control.uploadedFile.name }) : t('imageControl.selectFile')}
          </Button>
          {control.uploadedFile && (
            <p className="text-xs text-gray-500 mt-1">{t('imageControl.selectedFile', { filename: control.uploadedFile.name })}</p>
          )}
        </div>
      )}

      {control.status === 'loading' && (
        <p className="text-xs text-blue-600 mt-1 animate-pulse">
          {control.type === 'ai-generated' ? t('imageControl.generating') : t('imageControl.uploading')}
        </p>
      )}
      
      {control.status === 'succeeded' && control.imageUrl && (
        <div className="mt-2">
          <img 
            src={control.imageUrl} 
            alt={`Image for ${control.placeholderTag}`} 
            className="rounded border max-w-full h-auto cursor-pointer object-contain max-h-40 mx-auto"
            onClick={() => onViewImage(control.imageUrl!)}
          />
        </div>
      )}
      
      {control.status === 'failed' && (
        <p className="text-xs text-red-500 mt-1">{t('imageControl.generateFailed', { error: control.errorMessage || t('imageControl.unknownError') })}</p>
      )}
      
      <div className="flex items-center justify-between mt-1.5">
        {control.type === 'ai-generated' ? (
          <Button
            onClick={() => onGenerateImage(index)}
            disabled={control.status === 'loading' || !control.prompt?.trim() || disabled}
            size="sm"
            className="flex items-center"
          >
            {control.status === 'loading' ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : control.status === 'succeeded' ? (
              <RefreshCw size={16} className="mr-2" />
            ) : (
              <Sparkles size={16} className="mr-2" />
            )}
            {control.status === 'loading' ? t('imageControl.generatingBtn') : (control.status === 'succeeded' ? t('imageControl.regenerateBtn') : t('imageControl.generateBtn'))}
          </Button>
        ) : (
          control.status === 'succeeded' && control.imageUrl && (
            <Button onClick={() => onInsertImage(index)} size="sm" variant="outline" className="flex items-center">
              <PlusSquare size={16} className="mr-2" /> {t('imageControl.insert')}
            </Button>
          )
        )}
        
        {control.type === 'ai-generated' && control.status === 'succeeded' && control.imageUrl && (
          <Button onClick={() => onInsertImage(index)} size="sm" variant="outline" className="flex items-center">
            <PlusSquare size={16} className="mr-2" /> {t('imageControl.insert')}
          </Button>
        )}
      </div>
    </div>
  );
}; 