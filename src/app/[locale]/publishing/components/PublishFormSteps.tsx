'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  PublishState,
  PublishStepId,
  StepConfig,
  PublishFormStepsContainerProps,
  StepComponentProps,
} from '../types'; // Ensure StepComponentProps is imported
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { UploadCloud, Image as ImageIcon, Link2, Sparkles, X, Copy, Trash2, PlusCircle, CheckCircle, Globe, FileText, Monitor, Smartphone, Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from 'lucide-react';
import { predefinedStyles, StylePreset } from '../config/stylePresets'; // Ensure this import is present
import axios from 'axios'; // Added axios import
import { toast } from 'sonner'; // Ensure toast is imported
import { LucideImage } from 'lucide-react'; // Added LucideImage for clarity in one spot
import { useSession } from 'next-auth/react'; // Added useSession import
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import getConfig from 'next/config';

// Get runtime config
const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };

// --- Constants for Dify API ---
const DIFY_API_BASE_URL = 'https://ptminder.ptengine.com/v1';
const DIFY_APP_TOKEN = publicRuntimeConfig.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN || process.env.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN;
// IMPORTANT: We'll need a separate API key for file uploads for full functionality.
// const DIFY_FILE_UPLOAD_API_KEY = process.env.NEXT_PUBLIC_DIFY_FILE_UPLOAD_API_KEY;

// --- X Platform Preview Components ---
interface XPreviewProps {
  tweetThread: {
    main_post: string;
    thread_posts: string[];
  } | null;
  viewMode: 'desktop' | 'mobile';
}

const XPreview: React.FC<XPreviewProps> = ({ tweetThread, viewMode }) => {
  const t = useTranslations('publishing.xPreview');
  
  if (!tweetThread) return null;

  const allTweets = [tweetThread.main_post, ...tweetThread.thread_posts];
  const isDesktop = viewMode === 'desktop';

  const TweetCard: React.FC<{ content: string; index: number; isThread?: boolean }> = ({ 
    content, 
    index, 
    isThread = false 
  }) => (
    <div className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${
      isDesktop ? 'p-4' : 'p-3'
    } relative`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className={`${isDesktop ? 'w-12 h-12' : 'w-10 h-10'} bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 relative z-10`}>
          <span className="text-white font-bold text-sm">𝕏</span>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 dark:text-white text-sm">{t('userName')}</span>
            <span className="text-blue-500">
              <CheckCircle size={16} />
            </span>
            <span className="text-gray-500 text-sm">{t('userHandle')}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 text-sm">{t('timeAgo')}</span>
            {index > 0 && (
              <>
                <span className="text-gray-500">·</span>
                <span className="text-blue-500 text-sm">{t('threadIndicator', { current: index + 1, total: allTweets.length })}</span>
              </>
            )}
          </div>
          
          {/* Content */}
          <div className={`mt-1 text-gray-900 dark:text-white ${isDesktop ? 'text-base' : 'text-sm'} whitespace-pre-wrap`}>
            {content}
          </div>
          
          {/* Actions */}
          <div className={`flex justify-between items-center mt-3 max-w-md text-gray-500 ${
            isDesktop ? 'text-sm' : 'text-xs'
          }`}>
            <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
              <MessageCircle size={isDesktop ? 18 : 16} />
              <span>12</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
              <Repeat2 size={isDesktop ? 18 : 16} />
              <span>24</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
              <Heart size={isDesktop ? 18 : 16} />
              <span>156</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
              <Share size={isDesktop ? 18 : 16} />
            </div>
            <div className="hover:text-gray-700 cursor-pointer">
              <MoreHorizontal size={isDesktop ? 18 : 16} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Thread connecting line from previous tweet */}
      {isThread && index > 0 && (
        <div 
          className={`absolute w-0.5 bg-gray-300 dark:bg-gray-600 ${
            isDesktop ? 'left-10' : 'left-8'
          }`}
          style={{ 
            top: isDesktop ? '-16px' : '-12px',
            height: isDesktop ? '28px' : '24px'
          }}
        />
      )}
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
      isDesktop ? 'max-w-2xl' : 'max-w-sm'
    }`}>
      {/* Header */}
      <div className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${
        isDesktop ? 'p-4' : 'p-3'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white">{t('postThread')}</h3>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-black dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-xs">𝕏</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tweets */}
      <div className="relative">
        {allTweets.map((tweet, index) => (
          <TweetCard 
            key={index}
            content={tweet} 
            index={index} 
            isThread={index > 0}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className={`bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${
        isDesktop ? 'p-4' : 'p-3'
      }`}>
        <p className="text-xs text-gray-500 text-center">
          {t('previewText')}
        </p>
      </div>
    </div>
  );
};

// --- Re-usable Stepper/Progress Indicator --- (Could be moved to its own file too)
interface StepperDisplayProps {
  currentStepIndex: number;
  stepsConfig: StepConfig[];
  onStepSelect?: (index: number) => void; // Added onStepSelect for clickability
}
const StepperDisplay: React.FC<StepperDisplayProps> = ({ currentStepIndex, stepsConfig, onStepSelect }) => {
  const t = useTranslations('publishing.stepper');
  
  return (
    <div className="mb-4">
      {/* 步骤进度容器 - 添加圆角和背景，与下方Card保持一致 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('stepCounter', { current: currentStepIndex + 1, total: stepsConfig.length })}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('progressComplete', { percent: Math.round(((currentStepIndex + 1) / stepsConfig.length) * 100) })}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStepIndex + 1) / stepsConfig.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Step Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {stepsConfig.map((step, index) => {
          const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

          return (
              <div
                key={step.id}
                className={`relative rounded-md border transition-all duration-200 cursor-pointer hover:shadow-sm ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : isCurrent
                    ? 'bg-primary/5 border-primary ring-1 ring-primary/20 dark:bg-primary/10 dark:border-primary' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                }`}
                onClick={() => onStepSelect?.(index)}
              >
                <div className="p-2.5 text-center">
                  {/* Step Icon/Number */}
                  <div className={`w-6 h-6 mx-auto mb-1.5 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={12} />
                    ) : (
                      index + 1
                    )}
                </div>
                  
                  {/* Step Name */}
                  <span className={`text-xs font-medium block leading-tight ${
                    isCurrent 
                      ? 'text-primary dark:text-primary' 
                      : isCompleted
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {step.name.replace(/^\d+\.\s*/, '')}
                  </span>
                  
                  {/* Current Step Indicator */}
                  {isCurrent && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

// --- Placeholder Step Components --- (These would eventually be more detailed)

// Custom X Platform Icon Component
const XIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
  <div 
    className={`flex items-center justify-center bg-black dark:bg-white rounded ${className}`}
    style={{ width: size, height: size }}
  >
    <span 
      className="text-white dark:text-black font-bold" 
      style={{ fontSize: size * 0.6 }}
    >
      𝕏
    </span>
    </div>
);

const SelectPlatformsStep: React.FC<StepComponentProps> = ({ updateData, currentData, articleTitle }) => {
  const t = useTranslations('publishing');
  
  const platforms = [
    { id: 'x', name: t('platforms.x.name'), icon: XIcon, description: t('platforms.x.description') },
    { id: 'wordpress', name: t('platforms.wordpress.name'), icon: Globe, description: t('platforms.wordpress.description') },
    { id: 'note', name: t('platforms.note.name'), icon: FileText, description: t('platforms.note.description') }
  ];

  // Ensure 'note' is always selected on initialization
  React.useEffect(() => {
    if (!currentData.selectedPlatforms.includes('note')) {
      updateData({ selectedPlatforms: [...currentData.selectedPlatforms, 'note'] });
    }
  }, []);

  const handlePlatformToggle = (platformId: string) => {
    // Prevent removing 'note' platform
    if (platformId === 'note') {
      return; // Do nothing, Internal Note cannot be removed
    }
    
    const isSelected = currentData.selectedPlatforms.includes(platformId);
    if (isSelected) {
      // Remove platform
      const newPlatforms = currentData.selectedPlatforms.filter(id => id !== platformId);
      updateData({ selectedPlatforms: newPlatforms });
    } else {
      // Add platform
      const newPlatforms = [...currentData.selectedPlatforms, platformId];
      updateData({ selectedPlatforms: newPlatforms });
    }
  };

  const handleRemovePlatform = (platformId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    
    // Prevent removing 'note' platform
    if (platformId === 'note') {
      return; // Do nothing, Internal Note cannot be removed
    }
    
    const newPlatforms = currentData.selectedPlatforms.filter(id => id !== platformId);
    updateData({ selectedPlatforms: newPlatforms });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map(platform => {
          const isSelected = currentData.selectedPlatforms.includes(platform.id);
          const isRequired = platform.id === 'note'; // Internal Note is required
          return (
            <Card 
              key={platform.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md relative ${
                isSelected 
                  ? 'ring-2 ring-primary border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              } ${isRequired ? 'ring-2 ring-blue-500 border-blue-50 dark:bg-blue-950/20' : ''}`}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <CardContent className="p-6 text-center">
                {platform.id === 'x' ? (
                  <platform.icon size={32} className="mx-auto mb-3" />
                ) : (
                  <platform.icon size={32} className={`mx-auto mb-3 ${isRequired ? 'text-blue-600 dark:text-blue-400' : 'text-primary'}`} />
                )}
                <h3 className={`font-semibold mb-2 ${isRequired ? 'text-blue-900 dark:text-blue-100' : ''}`}>
                  {platform.name}
                  {isRequired && <span className="text-blue-600 dark:text-blue-400 ml-1">*</span>}
                </h3>
                <p className={`text-sm ${isRequired ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                  {platform.description}
                </p>
              </CardContent>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 p-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <CheckCircle className={`${isRequired ? 'text-blue-600 dark:text-blue-400' : 'text-primary'}`} size={20} />
  </div>
              )}
              
              {/* Required badge for Internal Note */}
              {isRequired && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {t('platforms.note.required')}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      {/* Help text */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {t('platforms.note.noteText')}
        </p>
      </div>
    </div>
  );
};

const ConfigureCoverImageStep: React.FC<StepComponentProps> = ({ updateData, currentData, articleTitle }) => {
  const t = useTranslations('publishing');
  
  const initialStyleId = predefinedStyles.find(s => s.id === currentData.coverImageStyle)?.id || 
                         ((currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) || (currentData.referenceImageUrls && currentData.referenceImageUrls.length > 0) ? null : 'style-custom');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(initialStyleId);
  const { data: session } = useSession(); // Called useSession hook
  
  const DIFY_WORKFLOW_RUN_ENDPOINT = `${DIFY_API_BASE_URL}/workflows/run`; // Defined DIFY_WORKFLOW_RUN_ENDPOINT here
  
  const [referenceImageMode, setReferenceImageMode] = useState<'upload' | 'url'>('upload');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false); // Unified loading state
  const [error, setError] = useState<string | null>(null); // Error state already present, good
  const [isAiAssistingPrompt, setIsAiAssistingPrompt] = useState(false); // New state for AI Assist button

  // 1. Add generation history
  const [generationHistory, setGenerationHistory] = useState<Array<{
    id: string;
    prompt: string;
    imageUrl: string;
    timestamp: Date;
  }>>([]);

  // 2. Quick adjustment options
  const quickAdjustments = [
    { label: t('coverImage.adjustments.brighter'), prompt: ', bright and vivid' },
    { label: t('coverImage.adjustments.professional'), prompt: ', professional and clean' },
    { label: t('coverImage.adjustments.creative'), prompt: ', creative and artistic' },
    { label: t('coverImage.adjustments.addTextSpace'), prompt: ', with space for text overlay' }
  ];

  // Effect to sync selectedStyleId with currentData (e.g., when loading from localStorage)
  useEffect(() => {
    const hasReferenceImages = (currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) ||
                               (currentData.referenceImageUrls && currentData.referenceImageUrls.length > 0);
    
    if (hasReferenceImages) {
      setSelectedStyleId(null); // If there are reference images, don't select a predefined style implicitly
      if (currentData.coverImageStyle && currentData.coverImageStyle !== '') {
        updateData({ coverImageStyle: '' }); 
      }
    } else {
      if (selectedStyleId === null || currentData.coverImageStyle === '') {
         const styleToSet = predefinedStyles.find(s => s.id === currentData.coverImageStyle)?.id || 'style-custom';
         setSelectedStyleId(styleToSet);
         if (currentData.coverImageStyle !== styleToSet && styleToSet === 'style-custom') {
           updateData({ coverImageStyle: 'style-custom' });
         }
      }
    }
  }, [currentData.referenceImageFiles, currentData.referenceImageUrls, currentData.coverImageStyle, updateData]);


  const handleStyleSelect = (styleId: string | null) => {
    setSelectedStyleId(styleId);
    const selected = predefinedStyles.find(s => s.id === styleId);
    updateData({
      coverImageStyle: selected ? selected.id : '',
      referenceImageFiles: [], 
      referenceImageUrls: [], 
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const totalExistingImages = (currentData.referenceImageFiles?.length || 0) + (currentData.referenceImageUrls?.length || 0);
      const filesArray = Array.from(event.target.files).slice(0, 1 - totalExistingImages);
      
      console.log('[handleFileChange] Files selected from input:', event.target.files);
      console.log('[handleFileChange] filesArray prepared:', filesArray);
      filesArray.forEach((file, idx) => {
        console.log(`[handleFileChange] filesArray[${idx}] is File: ${file instanceof File}`, file);
      });

      if (filesArray.length > 0) {
        updateData({
          referenceImageFiles: [...(currentData.referenceImageFiles || []), ...filesArray],
          referenceImageUrls: [], 
          coverImageStyle: '', 
        });
        setSelectedStyleId(null); 
      }
      event.target.value = '' 
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isValidHttpUrl = (string: string) => {
    let url;
    try { url = new URL(string); } catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:" || url.protocol.startsWith('blob:');
  };

  const handleAddImageByUrl = () => {
    const trimmedUrl = imageUrlInput.trim();
    if (trimmedUrl && isValidHttpUrl(trimmedUrl)) {
      const totalExistingImages = (currentData.referenceImageFiles?.length || 0) + (currentData.referenceImageUrls?.length || 0);
      if (totalExistingImages < 1) { 
        updateData({
          referenceImageUrls: [...(currentData.referenceImageUrls || []), trimmedUrl],
          referenceImageFiles: [], 
          coverImageStyle: '',
        });
        setSelectedStyleId(null);
        setImageUrlInput('');
      } else {
        toast.error(t('coverImage.maxReferenceImages')); 
      }
    } else {
      toast.error(t('coverImage.invalidImageUrl'));
    }
  };

  const removeReferenceImageFile = (index: number) => {
    updateData({
      referenceImageFiles: currentData.referenceImageFiles?.filter((_, i) => i !== index),
    });
    const noFilesLeft = currentData.referenceImageFiles?.length === 1 && (currentData.referenceImageUrls?.length || 0) === 0;
    if (noFilesLeft && !selectedStyleId && currentData.coverImageStyle === '') {
        handleStyleSelect('style-custom');
    }
  };

  const removeReferenceImageUrl = (index: number) => {
    updateData({
      referenceImageUrls: currentData.referenceImageUrls?.filter((_, i) => i !== index),
    });
    const noUrlsLeft = currentData.referenceImageUrls?.length === 1 && (currentData.referenceImageFiles?.length || 0) === 0;
    if (noUrlsLeft && !selectedStyleId && currentData.coverImageStyle === '') {
        handleStyleSelect('style-custom');
    }
  };

  const handleGenerateImage = async () => {
    console.log("[ENV_CHECK] DIFY_WORKFLOW_APP_TOKEN in component:", publicRuntimeConfig.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN || process.env.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN);
    console.log("[ENV_CHECK] DIFY_FILE_UPLOAD_TOKEN in component:", publicRuntimeConfig.NEXT_PUBLIC_DIFY_FILE_UPLOAD_TOKEN || process.env.NEXT_PUBLIC_DIFY_FILE_UPLOAD_TOKEN);

    setIsGenerating(true);
    setError(null);
    updateData({ coverImageUrl: null, coverImageBase64: null, finalCoverImageFile: null });

    const DIFY_WORKFLOW_APP_TOKEN = publicRuntimeConfig.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN || process.env.NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN;
    const DIFY_FILE_UPLOAD_TOKEN = publicRuntimeConfig.NEXT_PUBLIC_DIFY_FILE_UPLOAD_TOKEN || process.env.NEXT_PUBLIC_DIFY_FILE_UPLOAD_TOKEN;

    const DIFY_FILE_UPLOAD_ENDPOINT = `${DIFY_API_BASE_URL}/files/upload`;
    const DIFY_WORKFLOW_RUN_ENDPOINT = `${DIFY_API_BASE_URL}/workflows/run`;

    // Log the constructed endpoint to verify
    console.log("[DifyUpload] Constructed File Upload Endpoint:", DIFY_FILE_UPLOAD_ENDPOINT);
    console.log("[DifyWorkflow] Constructed Workflow Run Endpoint:", DIFY_WORKFLOW_RUN_ENDPOINT);


    const workflowPayload: any = {
      inputs: {
        user_email: session?.user?.email || `fallback-user-${Date.now()}`, // Unified user identification parameter
        cover_image_style: currentData.coverImageStyle === 'style-custom' || (!currentData.coverImageStyle && !currentData.referenceImageFiles?.length && !currentData.referenceImageUrls?.length) 
          ? null 
          : predefinedStyles.find(s => s.id === currentData.coverImageStyle)?.description || null,
        cover_image_prompt: currentData.coverImagePrompt || "Generate a blog cover image.",
        // reference_Image will be added below based on conditions
      },
      response_mode: "blocking", // Or "streaming" if you prefer
      user: session?.user?.email || `fallback-user-${Date.now()}`, // Changed to use session email
      files: [], // Always an empty array as per Dify UI logs for workflow run
    };

    let uploadedFileData: any = null;

    // 1. If there's a local reference image, upload it first
    if (currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) {
      const fileToUpload = currentData.referenceImageFiles[0];
      try {
        console.log("[DifyUpload] Attempting to upload reference file to Dify:", fileToUpload.name);
        // ... (logging for endpoint and token) ...
        
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('user', workflowPayload.user); // Use the same user for consistency

        console.log("[DifyUpload] FormData content being sent (file):", fileToUpload.name);
        console.log("[DifyUpload] FormData content being sent (user):", workflowPayload.user);
        
        const uploadResponse = await fetch(DIFY_FILE_UPLOAD_ENDPOINT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${DIFY_FILE_UPLOAD_TOKEN}`,
            // 'Content-Type' is set automatically by browser for FormData
          },
          body: formData,
        });

        console.log("[DifyUpload] Dify File Upload API Response Status:", uploadResponse.status, uploadResponse.statusText);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("[DifyUpload] Dify File Upload API Error Response Text:", errorText);
          throw new Error(`Dify File Upload API Error: ${uploadResponse.status} - ${errorText}`);
        }
        
        uploadedFileData = await uploadResponse.json();
        console.log("[DifyUpload] Dify File Upload API Response JSON Parsed:", uploadedFileData);

        if (!uploadedFileData.id) {
            console.error("[DifyUpload] Error: Dify file upload response did not include an ID.", uploadedFileData);
            throw new Error("Dify file upload response did not include an ID.");
        }
        
        // Construct reference_Image for workflow using the uploaded file ID
        workflowPayload.inputs.reference_Image = {
          type: "image",
          transfer_method: "local_file",
          url: "", // Empty string as per Dify UI logs
          upload_file_id: uploadedFileData.id
        };
        console.log("[DifyWorkflow] reference_Image (local file) payload:", workflowPayload.inputs.reference_Image);

      } catch (uploadError: any) {
        console.error("[DifyUpload] Error during Dify file upload:", uploadError.message, uploadError.stack);
        setError(`Failed to upload reference image to Dify: ${uploadError.message}`);
        setIsGenerating(false);
        return;
      }
    } else if (currentData.referenceImageUrls && currentData.referenceImageUrls.length > 0) {
      // Construct reference_Image for workflow using the remote URL
      workflowPayload.inputs.reference_Image = {
        type: "image",
        transfer_method: "remote_url",
        url: currentData.referenceImageUrls[0]
      };
      console.log("[DifyWorkflow] reference_Image (remote URL) payload:", workflowPayload.inputs.reference_Image);
    }
    // If neither local file nor remote URL, reference_Image is omitted from inputs.

    // 2. Run the Dify workflow
    try {
      if (!DIFY_WORKFLOW_APP_TOKEN) {
        throw new Error("Dify Workflow App Token (NEXT_PUBLIC_DIFY_FLOW8_APP_TOKEN) is not configured.");
      }

      const workflowResponse = await fetch(DIFY_WORKFLOW_RUN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_WORKFLOW_APP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowPayload),
      });

      if (!workflowResponse.ok) {
        const errorData = await workflowResponse.json().catch(() => ({ message: workflowResponse.statusText }));
        throw new Error(`Dify API Error: ${workflowResponse.status} - ${errorData.message || 'Unknown error'}`);
      }

      const result = await workflowResponse.json();
      console.log("Dify API Response:", result);

      let temporaryImageUrl = null;

      // Adjusted parsing based on Dify's typical workflow output structure for files
      if (result.data && result.data.outputs) {
        // Iterate through outputs to find the one that looks like a file or image URL
        for (const key in result.data.outputs) {
          const outputValue = result.data.outputs[key];
          if (typeof outputValue === 'string' && (outputValue.startsWith('http://') || outputValue.startsWith('https://')) && (outputValue.endsWith('.png') || outputValue.endsWith('.jpg') || outputValue.endsWith('.jpeg'))) {
            temporaryImageUrl = outputValue;
            break;
          }
          if (Array.isArray(outputValue) && outputValue.length > 0) {
            const firstItem = outputValue[0];
            if (typeof firstItem === 'object' && firstItem !== null && typeof firstItem.url === 'string' && firstItem.url.startsWith('http')) {
              temporaryImageUrl = firstItem.url; // Assuming this is the structure like { url: "...", ... }
              break;
            }
          }
        }
      }
      
      // Fallback to previous parsing logic if the above doesn't find it
      if (!temporaryImageUrl && result.cover_files && Array.isArray(result.cover_files) && result.cover_files.length > 0) {
        const firstFile = result.cover_files[0];
        if (firstFile && typeof firstFile.url === 'string' && firstFile.url.startsWith('http')) {
          temporaryImageUrl = firstFile.url;
        }
      }


      if (temporaryImageUrl) {
        console.log("Temporary image URL from Dify:", temporaryImageUrl);
        // Download the image and convert to Base64
        try {
          const imageResponse = await axios.get(temporaryImageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000, // 30 seconds timeout
          });
          const imageBuffer = Buffer.from(imageResponse.data, 'binary');
          const base64Data = imageBuffer.toString('base64');
          
          // Determine MIME type (though for cover, 'image/png' or 'image/jpeg' is likely)
          // For simplicity, we'll assume it's png or jpeg. Dify might provide mime_type.
          const mimeType = imageResponse.headers['content-type'] || 'image/png'; 
          const finalBase64String = `data:${mimeType};base64,${base64Data}`;

          console.log("Image downloaded and converted to Base64.");
          updateData({ 
            coverImageBase64: finalBase64String, 
            coverImageUrl: null, // Clear the temporary URL
            finalCoverImageFile: null // Clear any manually uploaded final cover
          });
          toast.success('Cover image generated and saved!');
        } catch (downloadError: any) {
          console.error("Error downloading or converting image:", downloadError);
          setError(`Failed to process generated image: ${downloadError.message}`);
          toast.error(`Failed to process generated image: ${downloadError.message}`);
          // Optionally, keep the temporary URL if download fails but generation was "successful"
          updateData({ coverImageUrl: temporaryImageUrl, coverImageBase64: null }); 
        }
      } else {
        console.error("Could not extract image URL from Dify response:", result);
        throw new Error("Failed to get image URL from Dify response.");
      }

    } catch (e: any) {
      console.error("Error generating image with Dify:", e);
      setError(e.message);
      toast.error(`Error: ${e.message}`);
    } finally {
      setIsGenerating(false); // Ensure loading state is reset in all cases
    }
  };

  const handleAiAssistPrompt = async () => {
    if (!currentData.articleId) {
      toast.error("Article ID is missing. Cannot fetch content for AI Assist.");
      return;
    }

    setIsAiAssistingPrompt(true);
    toast.info("Fetching article content for AI Assist...");

    try {
      // 1. Fetch article content
      const articleResponse = await axios.get(`/api/articles/${currentData.articleId}`);
      const articleContent = articleResponse.data?.article?.content;

      if (!articleContent) {
        toast.error("Failed to fetch article content or content is empty.");
        setIsAiAssistingPrompt(false);
        return;
      }

      toast.info("Article content fetched. Generating prompt with AI...");

      // 2. Call Dify API (Flow 9)
      const DIFY_FLOW9_APP_TOKEN = publicRuntimeConfig.NEXT_PUBLIC_DIFY_FLOW9_APP_TOKEN || process.env.NEXT_PUBLIC_DIFY_FLOW9_APP_TOKEN; 

      if (!DIFY_FLOW9_APP_TOKEN) {
        toast.error("AI Assist configuration error: Dify Flow 9 App Token is missing.");
        console.error("Missing NEXT_PUBLIC_DIFY_FLOW9_APP_TOKEN in environment variables.");
        setIsAiAssistingPrompt(false);
        return;
      }

      const aiAssistPayload = {
        inputs: {
          user_email: session?.user?.email || `fallback-prompt-user-${Date.now()}`, // Unified user identification parameter
          current_prompt: currentData.coverImagePrompt || "",
          article_topic: articleTitle || "general blog topic", // Used articleTitle prop
          image_style_preference: predefinedStyles.find(s => s.id === currentData.coverImageStyle)?.description || "any style", // Example
          articles_publish: articleContent, // Added missing required input
        },
        response_mode: "blocking",
        user: session?.user?.email || `fallback-prompt-user-${Date.now()}`, // Changed to use session email
      };

      console.log("[DifyPromptAssist] Calling Dify Workflow for prompt assistance. Endpoint:", DIFY_WORKFLOW_RUN_ENDPOINT);
      console.log("[DifyPromptAssist] Payload:", JSON.stringify(aiAssistPayload, null, 2)); // Added detailed payload logging

      const difyResponse = await axios.post(
        `${DIFY_API_BASE_URL}/workflows/run`,
        aiAssistPayload,
        {
          headers: {
            Authorization: `Bearer ${DIFY_FLOW9_APP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the entire successful response data from Dify
      console.log("[DifyPromptAssist] Dify Flow 9 Full Response Data:", JSON.stringify(difyResponse.data, null, 2));

      // Assuming Dify response structure is similar to other flows
      // User specified output variable: cover_image_prompt
      const generatedPrompt = difyResponse.data?.data?.outputs?.cover_imgae_prompt; // Changed back to match Dify's actual output name

      if (generatedPrompt && typeof generatedPrompt === 'string') {
        updateData({ coverImagePrompt: generatedPrompt });
        toast.success("AI-assisted prompt generated successfully!");
      } else {
        console.error("Dify Flow 9 response error or unexpected structure:", difyResponse.data);
        toast.error("Failed to generate prompt. AI service returned an unexpected response.");
      }
    } catch (err: any) {
      console.error("Error during AI Assist prompt generation:", err);
      if (err.response) {
        // Log the full error response from Dify if available
        console.error("Dify API Error Response:", JSON.stringify(err.response.data, null, 2));
        toast.error(`Dify API Error: ${err.response.data?.message || err.response.data?.error || err.message || 'Unknown API error'}`);
      } else {
        toast.error(`An error occurred: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsAiAssistingPrompt(false);
    }
  };

  const totalReferenceImages = (currentData.referenceImageFiles?.length || 0) + (currentData.referenceImageUrls?.length || 0);
  const canAddMoreImages = totalReferenceImages < 1; 
  const finalCoverFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTriggerFinalCoverInput = () => {
    finalCoverFileInputRef.current?.click();
  };

  const handleFinalCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      updateData({ finalCoverImageFile: file });
      event.target.value = ''; 
    }
  };

  const removeFinalCoverImage = () => {
    updateData({ finalCoverImageFile: null });
  };

  const HiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*, .jpeg, .png, .webp, .gif"
      onChange={handleFileChange}
      className="hidden"
      disabled={!canAddMoreImages}
    />
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 max-w-6xl mx-auto">
      {HiddenFileInput}
      {/* Left Column: Controls */}
      <div className="flex-grow lg:w-2/3 space-y-4">
        {/* 1. Select Generation Style - Horizontal Scroll */}
        <div>
          <h4 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">{t('coverImage.selectGenerationStyle')}</h4>
          <div className="flex overflow-x-auto space-x-3 pb-3 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {predefinedStyles.map(style => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
                disabled={((currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) || (currentData.referenceImageUrls && currentData.referenceImageUrls.length > 0)) && style.id !== 'style-custom'}
                className={`relative group border-2 rounded-lg overflow-hidden aspect-video flex-shrink-0 w-40 md:w-44 flex flex-col items-center justify-end text-center p-1 cursor-pointer transition-all 
                            ${selectedStyleId === style.id ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}
                            ${(((currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) || (currentData.referenceImageUrls && currentData.referenceImageUrls.length > 0)) && style.id !== 'style-custom') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {style.imageUrl ? 
                  <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover absolute inset-0" /> :
                  <ImageIcon size={36} className={`m-auto ${selectedStyleId === style.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-300'}`} />
                }
                <span className={`relative z-10 text-[10px] sm:text-[11px] font-semibold p-0.5 rounded-sm transition-colors 
                                ${selectedStyleId === style.id ? 'bg-indigo-500 text-white' : 'bg-black bg-opacity-40 text-white group-hover:bg-indigo-500 group-hover:text-white'}`}>
                  {style.name}
                </span>
                {selectedStyleId === style.id && (
                  <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full p-0.5 z-20">
                    <CheckCircle size={10} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Reference Image */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('coverImage.referenceImage')}</h4> 
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {t('coverImage.referenceImageNote')}
          </p>
          <div className="mb-3 flex items-center gap-2">
              <Button 
                variant={referenceImageMode === 'upload' ? 'default': 'outline'} 
                size="sm" 
                onClick={() => { setReferenceImageMode('upload'); if(canAddMoreImages) handleTriggerFileInput(); }}
                disabled={!canAddMoreImages && referenceImageMode === 'upload'}
                className="rounded-full px-4">
                  {t('coverImage.localUpload')} {referenceImageMode === 'upload' && !canAddMoreImages ? t('coverImage.limitReached') : ""}
              </Button>
              <Button 
                variant={referenceImageMode === 'url' ? 'default': 'outline'} 
                size="sm" 
                onClick={() => setReferenceImageMode('url')} 
                className="rounded-full px-4">
                  {t('coverImage.imageUrl')} {referenceImageMode === 'url' && !canAddMoreImages ? t('coverImage.limitReached') : ""}
              </Button>
          </div>
          {referenceImageMode === 'url' && (
              <div className="flex items-center gap-2 mt-3">
                  <input 
                      type="url"
                      placeholder={t('coverImage.imageUrlPlaceholder')}
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-grow p-2.5 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={!canAddMoreImages}
                  />
                  <Button onClick={handleAddImageByUrl} size="default" disabled={!canAddMoreImages || !imageUrlInput.trim()}>{t('coverImage.addButton')}</Button>
              </div>
          )}
          
          {(() => {
            console.log('[Render] currentData.referenceImageFiles before map:', currentData.referenceImageFiles);
            if (currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) {
              currentData.referenceImageFiles.forEach((file, idx) => {
                console.log(`[Render] currentData.referenceImageFiles[${idx}] is File: ${file instanceof File}`, file);
              });
            }

            return ((currentData.referenceImageFiles && currentData.referenceImageFiles.length > 0) || 
                    (currentData.referenceImageUrls && currentData.referenceImageUrls.length > 0)) && (
              <div className="mt-4 grid grid-cols-1 gap-3">
                {currentData.referenceImageFiles?.map((file, index) => {
                  if (!(file instanceof File)) {
                    console.warn(`Item at index ${index} in referenceImageFiles is not a File object. Skipping preview.`, file);
                    return (
                      <div key={`invalid-file-${index}`} className="relative group aspect-video border border-red-500 dark:border-red-700 rounded-lg overflow-hidden shadow-sm max-w-xs mx-auto flex items-center justify-center">
                        <p className="text-red-500 text-xs p-2">{t('coverImage.invalidFileData')}</p>
                      </div>
                    );
                  }
                  try {
                    const imageUrl = URL.createObjectURL(file);
                    console.log(`[Render] Created Object URL for ${file.name}: ${imageUrl}`);
                    return (
                      <div key={`file-preview-${index}`} style={{ position: 'relative', border: '2px solid red', width: '200px', height: '150px', marginBottom: '10px' }}>
                        <img
                          src={imageUrl}
                          alt={`Preview ${file.name}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => console.error(`[Render] Img load error for ${file.name}`, e)}
                        />
                        <button 
                          onClick={() => removeReferenceImageFile(index)} 
                          style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
                          title={t('coverImage.removeImage')}
                        >
                          X
                        </button>
                      </div>
                    );
                  } catch (error) {
                    console.error(`[Render] Error creating object URL for reference file ${file.name}:`, error);
                    return (
                      <div key={`error-file-${index}`} className="relative group aspect-video border border-red-500 dark:border-red-700 rounded-lg overflow-hidden shadow-sm max-w-xs mx-auto flex items-center justify-center">
                        <p className="text-red-500 text-xs p-2">{t('coverImage.previewError')}</p>
                      </div>
                    );
                  }
                })}
                {currentData.referenceImageUrls?.map((url, index) => {
                  console.log(`[Render] Attempting to render URL: ${url}`);
                  return (
                    <div 
                      key={`url-preview-${index}`} 
                      style={{ border: '2px solid blue', width: '200px', height: '150px', marginBottom: '10px', position: 'relative' }} // Explicit style for URL image container
                    >
                      <img 
                          src={url} 
                          alt={`Preview URL ${url.substring(0,30)}...`} 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Ensure image tries to fill
                          onError={(e) => {
                            console.error(`[Render] Img load error for URL: ${url}`, e); 
                            if (e.currentTarget instanceof HTMLImageElement) {
                              e.currentTarget.style.border = '2px solid orange';
                              e.currentTarget.alt = `Cannot load: ${url.substring(0, 50)}...`;
                            }
                          }}
                          onLoad={(e) => {
                            console.log(`[Render] Img onLoad fired for URL: ${url}`, e);
                            if (e.currentTarget instanceof HTMLImageElement) {
                                console.log(`[Render] Natural dimensions for ${url}: ${e.currentTarget.naturalWidth}x${e.currentTarget.naturalHeight}`);
                                if (e.currentTarget.naturalWidth === 0 || e.currentTarget.naturalHeight === 0) {
                                    console.warn(`[Render] Image loaded but has zero dimensions: ${url}`);
                                    e.currentTarget.style.border = '2px dashed red'; // Indicate zero dimension issue
                                }
                            }
                          }}
                      />
                      <button 
                        onClick={() => removeReferenceImageUrl(index)} 
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,255,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
                        title={t('coverImage.removeImageUrl')}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* 3. Prompt */}
        <div>
          <div className="flex justify-between items-center mb-1">
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('coverImage.prompt')}</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-600 dark:hover:bg-purple-900/30 rounded-full px-3"
                onClick={handleAiAssistPrompt}
                disabled={isAiAssistingPrompt || !currentData.articleId}
              >
                  <Sparkles size={14} className="mr-1.5" />
                  {isAiAssistingPrompt ? t('coverImage.aiAssistGenerating') : t('coverImage.aiAssist')}
              </Button>
          </div>
          <textarea
            placeholder={t('coverImage.promptPlaceholder')}
            value={currentData.coverImagePrompt || ''}
            onChange={(e) => updateData({ coverImagePrompt: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md h-32 min-h-[8rem] dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            rows={5}
          />
          <div className="mt-1.5 flex justify-end space-x-1.5">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8" title={t('coverImage.copyPrompt')} onClick={() => navigator.clipboard.writeText(currentData.coverImagePrompt || '')}><Copy size={16} /></Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8" title={t('coverImage.clearPrompt')} onClick={() => updateData({coverImagePrompt: ''})}><Trash2 size={16} /></Button>
          </div>
        </div>

        {/* 4. Generate Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
          <Button 
              onClick={handleGenerateImage} 
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out disabled:opacity-70"
              disabled={isGenerating || !currentData.coverImagePrompt}
          >
            {isGenerating ? t('coverImage.generating') : t('coverImage.generateImage')}
          </Button>
        </div>

        {/* 5. Quick Adjustments - Temporarily disabled
        <div className="flex gap-2 mb-4">
          {quickAdjustments.map(adjustment => (
            <Button
              key={adjustment.label}
              variant="outline"
              size="sm"
              onClick={() => {
                const currentPrompt = currentData.coverImagePrompt || '';
                updateData({ 
                  coverImagePrompt: currentPrompt + adjustment.prompt 
                });
              }}
            >
              {adjustment.label}
            </Button>
          ))}
        </div>
        */}
      </div>

      {/* Right Column: Preview Area */}
      <div className="lg:w-1/3 space-y-4 lg:sticky lg:top-24" style={{ alignSelf: 'flex-start' }}> 
        <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('coverImage.finalCoverImage')}</h4>
        <div className="relative aspect-video bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-inner">
          {currentData.finalCoverImageFile && currentData.finalCoverImageFile instanceof File ? (
            (() => {
              try {
                const imageUrl = URL.createObjectURL(currentData.finalCoverImageFile);
                return (
                  <img 
                    src={imageUrl} 
                    alt="Final cover preview" 
                    className="max-w-full max-h-full object-contain" 
                    onLoad={(e) => {
                      // Optional: Only revoke if you are sure it's not needed anymore.
                      // For React state, it's often better to revoke when the component unmounts or the file changes.
                      // URL.revokeObjectURL((e.target as HTMLImageElement).src); 
                    }}
                  />
                );
              } catch (error) {
                console.error('Error creating object URL for final cover file:', error, currentData.finalCoverImageFile);
                return <LucideImage size={48} className="text-red-500 dark:text-red-400" />;
              }
            })()
          ) : currentData.coverImageBase64 ? ( // Check for Base64 data first
            <img 
              src={currentData.coverImageBase64} 
              alt="Generated cover image" 
              className="max-w-full max-h-full object-contain" 
            />
          ) : currentData.coverImageUrl ? ( // Fallback to coverImageUrl (though it might be expired)
            <img 
              src={currentData.coverImageUrl} 
              alt="Generated cover image (temporary)" 
              className="max-w-full max-h-full object-contain" 
            />
          ) : (
            <LucideImage size={48} className="text-gray-400 dark:text-gray-500" />
          )}
          {currentData.finalCoverImageFile && (
             <button 
                onClick={removeFinalCoverImage}
                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity z-10"
                title={t('coverImage.removeCover')}
             >
                <X size={14} />
             </button>
          )}
        </div>
        <input 
            type="file"
            ref={finalCoverFileInputRef}
            onChange={handleFinalCoverFileChange}
            className="hidden"
            accept="image/*, .jpeg, .png, .webp"
        />
        <Button 
            onClick={handleTriggerFinalCoverInput} 
            variant="outline" 
            className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-600 dark:hover:bg-indigo-900/30">
            <UploadCloud size={16} className="mr-2" />
            {t('coverImage.uploadFinalCover')}
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {currentData.finalCoverImageFile 
            ? t('coverImage.selectedLocalFile', { filename: currentData.finalCoverImageFile.name })
            : currentData.coverImageBase64 
              ? t('coverImage.showingAiGenerated')
              : t('coverImage.previewAfterGeneration')}
        </p>
      </div>
    </div>
  );
};

const AdaptContentXStep: React.FC<StepComponentProps> = ({ updateData, currentData, articleTitle }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const { data: session } = useSession();
  const t = useTranslations('publishing.xContentAdaptation');
  const tPreview = useTranslations('publishing.xPreview');
  
  const generateTweets = async () => {
    if (!currentData.articleId) {
      toast.error("Article ID is missing. Cannot fetch content for post generation.");
      return;
    }

    setIsGenerating(true);
    toast.info("Fetching article content for post generation...");

    try {
      // 1. Fetch article content
      const articleResponse = await axios.get(`/api/articles/${currentData.articleId}`);
      const articleContent = articleResponse.data?.article?.content;

      if (!articleContent) {
        toast.error("Failed to fetch article content or content is empty.");
        setIsGenerating(false);
        return;
      }

      toast.info("Article content fetched. Generating post thread with AI...");

      // 2. Call Dify API (Flow 11)
      const DIFY_FLOW11_APP_TOKEN = publicRuntimeConfig.NEXT_PUBLIC_DIFY_FLOW11_APP_TOKEN || process.env.NEXT_PUBLIC_DIFY_FLOW11_APP_TOKEN;

      if (!DIFY_FLOW11_APP_TOKEN) {
        toast.error("Post generation configuration error: Dify Flow 11 App Token is missing.");
        console.error("Missing NEXT_PUBLIC_DIFY_FLOW11_APP_TOKEN in environment variables.");
        setIsGenerating(false);
        return;
      }

      const tweetGenerationPayload = {
        inputs: {
          user_email: session?.user?.email || `fallback-tweet-user-${Date.now()}`,
          articles_publish: articleContent,
        },
        response_mode: "blocking",
        user: session?.user?.email || `fallback-tweet-user-${Date.now()}`,
      };

      console.log("[DifyPostGeneration] Calling Dify Workflow for post generation. Endpoint:", `${DIFY_API_BASE_URL}/workflows/run`);
      console.log("[DifyPostGeneration] Payload:", JSON.stringify(tweetGenerationPayload, null, 2));

      const difyResponse = await axios.post(
        `${DIFY_API_BASE_URL}/workflows/run`,
        tweetGenerationPayload,
        {
          headers: {
            Authorization: `Bearer ${DIFY_FLOW11_APP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Log the entire successful response data from Dify
      console.log("[DifyPostGeneration] Dify Flow 11 Full Response Data:", JSON.stringify(difyResponse.data, null, 2));

      // Extract the tweet thread from Dify response
      const generatedTweetData = difyResponse.data?.data?.outputs?.x_tread;

      if (generatedTweetData) {
        let tweetThread: { main_post: string; thread_posts: string[] };
        
        if (typeof generatedTweetData === 'string') {
          // If it's a string, try to parse it as JSON
          try {
            // First, check if it's wrapped in markdown code blocks and strip them
            let cleanedData = generatedTweetData.trim();
            if (cleanedData.startsWith('```json') && cleanedData.endsWith('```')) {
              // Remove the markdown code block markers
              cleanedData = cleanedData.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanedData.startsWith('```') && cleanedData.endsWith('```')) {
              // Handle generic code blocks
              cleanedData = cleanedData.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '');
            }
            
            tweetThread = JSON.parse(cleanedData);
          } catch (e) {
            console.warn("Failed to parse as JSON, falling back to legacy format:", e);
            // If parsing fails, treat as legacy format
            const tweets = generatedTweetData
              .split(/\n\n+|\d+\/\d+[\s\n]+/)
              .map(tweet => tweet.trim())
              .filter(tweet => tweet.length > 0 && tweet.length <= 280)
              .slice(0, 20);
            
            tweetThread = {
              main_post: tweets[0] || "",
              thread_posts: tweets.slice(1)
            };
          }
        } else if (typeof generatedTweetData === 'object' && generatedTweetData.main_post) {
          // If it's already an object with the expected structure
          tweetThread = generatedTweetData;
        } else {
          throw new Error("Unexpected post data format");
        }

        if (tweetThread.main_post && tweetThread.main_post.length > 0) {
          updateData({ 
            tweetThread,
            // Also update legacy format for backward compatibility
            generatedTweets: [tweetThread.main_post, ...tweetThread.thread_posts]
          });
          toast.success(`Successfully generated post thread with ${1 + tweetThread.thread_posts.length} posts!`);
        } else {
          console.error("No valid main post found in generated content:", generatedTweetData);
          toast.error("Failed to generate valid post thread. Please try again.");
        }
      } else {
        console.error("Dify Flow 11 response error or unexpected structure:", difyResponse.data);
        toast.error("Failed to generate posts. AI service returned an unexpected response.");
      }
    } catch (err: any) {
      console.error("Error during post generation:", err);
      if (err.response) {
        console.error("Dify API Error Response:", JSON.stringify(err.response.data, null, 2));
        toast.error(`Dify API Error: ${err.response.data?.message || err.response.data?.error || err.message || 'Unknown API error'}`);
      } else {
        toast.error(`An error occurred: ${err.message || 'Unknown error'}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMainPost = (content: string) => {
    if (currentData.tweetThread) {
      updateData({
        tweetThread: {
          ...currentData.tweetThread,
          main_post: content
        }
      });
    }
  };

  const updateThreadPost = (index: number, content: string) => {
    if (currentData.tweetThread) {
      const newThreadPosts = [...currentData.tweetThread.thread_posts];
      newThreadPosts[index] = content;
      updateData({
        tweetThread: {
          ...currentData.tweetThread,
          thread_posts: newThreadPosts
        }
      });
    }
  };

  const removeThreadPost = (index: number) => {
    if (currentData.tweetThread) {
      const newThreadPosts = currentData.tweetThread.thread_posts.filter((_, i) => i !== index);
      updateData({
        tweetThread: {
          ...currentData.tweetThread,
          thread_posts: newThreadPosts
        }
      });
    }
  };

  const addThreadPost = () => {
    if (currentData.tweetThread) {
      updateData({
        tweetThread: {
          ...currentData.tweetThread,
          thread_posts: [...currentData.tweetThread.thread_posts, '']
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{t('title')}</h3>
          <Button 
            onClick={generateTweets} 
            disabled={isGenerating || !currentData.articleId}
            variant="outline"
            size="lg"
            className={`rounded-full px-6 py-2.5 font-semibold shadow-sm hover:shadow-md transition-all duration-200 ${
              isGenerating 
                ? 'border-purple-400 bg-purple-50 text-purple-500 dark:bg-purple-900/20 dark:border-purple-500 dark:text-purple-300' 
                : 'border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-600 dark:hover:bg-purple-900/30'
            }`}
          >
            <Sparkles 
              size={18} 
              className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
            />
            {isGenerating ? t('generating') : t('generateButton')}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Main Content Area */}
      {currentData.tweetThread ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Edit Panel */}
          <div className="space-y-4">
            {/* Edit Panel Header */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <PlusCircle size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">{t('editPanel.title')}</h4>
                </div>
                <Button 
                  onClick={addThreadPost} 
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950/30"
                >
                  <PlusCircle size={16} className="mr-1" />
                  {t('editPanel.addThreadPost')}
                </Button>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                {t('editPanel.description')}
              </p>
            </div>

            {/* Edit Content Area */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 shadow-sm">
              {/* Main Post */}
              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="default" className="bg-blue-600">
                      {t('editPanel.mainPost')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {currentData.tweetThread.main_post.length}/{t('editPanel.charactersCount', { count: 280 })}
                    </span>
                  </div>
                  <Textarea
                    value={currentData.tweetThread.main_post}
                    onChange={(e) => updateMainPost(e.target.value)}
                    className={`min-h-[100px] resize-none ${
                      currentData.tweetThread.main_post.length > 280 ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    maxLength={280}
                    placeholder={t('editPanel.mainPostPlaceholder')}
                  />
                  {currentData.tweetThread.main_post.length > 280 && (
                    <p className="text-xs text-red-500 mt-1">
                      {t('editPanel.characterLimitError')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Thread Posts */}
              {currentData.tweetThread.thread_posts.map((post, index) => (
                <Card key={index} className="border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary">
                        {t('editPanel.post', { number: index + 1 })}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {post.length}/{t('editPanel.charactersCount', { count: 280 })}
                        </span>
                        <Button
                          onClick={() => removeThreadPost(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                          title={t('editPanel.removeThreadPost')}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={post}
                      onChange={(e) => updateThreadPost(index, e.target.value)}
                      className={`min-h-[80px] resize-none ${
                        post.length > 280 ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      maxLength={280}
                      placeholder={t('editPanel.threadPostPlaceholder', { number: index + 1 })}
                    />
                    {post.length > 280 && (
                      <p className="text-xs text-red-500 mt-1">
                        {t('editPanel.characterLimitError')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: Preview Panel */}
          <div className="space-y-4">
            {/* Preview Panel Header */}
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <Monitor size={16} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">{t('previewPanel.title')}</h4>
                </div>
                <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 border border-green-200 dark:border-green-700">
                  <Button
                    variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('desktop')}
                    className="h-8 px-3"
                  >
                    <Monitor size={16} className="mr-1" />
                    {t('previewPanel.desktop')}
                  </Button>
                  <Button
                    variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('mobile')}
                    className="h-8 px-3"
                  >
                    <Smartphone size={16} className="mr-1" />
                    {t('previewPanel.mobile')}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                {t('previewPanel.description')}
              </p>
            </div>
            
            {/* Preview Content Area */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex justify-center">
              <XPreview 
                tweetThread={currentData.tweetThread} 
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-black dark:bg-white rounded flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-lg">𝕏</span>
            </div>
            <h4 className="font-medium">{t('emptyState.title')}</h4>
            <p className="text-sm text-muted-foreground max-w-md">
              {t('emptyState.description')}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

const AdaptContentWordPressStep: React.FC<StepComponentProps> = ({ updateData, currentData, articleTitle }) => {
  const t = useTranslations('publishing.xContentAdaptation');
  
  return (
    <div>{t('title')}</div>
  );
};

const PreviewAndPublishStep: React.FC<StepComponentProps & { onPublishSuccess?: (formData: PublishState) => void }> = ({ 
  currentData, 
  updateData, 
  articleTitle, 
  onPublishSuccess 
}) => {
  const t = useTranslations('publishing.previewAndPublish');
  const tPlatforms = useTranslations('publishing.platforms');
  const [publishingStatus, setPublishingStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [publishError, setPublishError] = useState<string | null>(null);
  
  // Helper function to safely convert publishAt to string for datetime-local input
  const getPublishAtValue = () => {
    if (!currentData.publishAt) return '';
    
    try {
      // If it's already a Date object, use it directly
      if (currentData.publishAt instanceof Date) {
        return currentData.publishAt.toISOString().slice(0, 16);
      }
      
      // If it's a string, try to convert to Date first
      if (typeof currentData.publishAt === 'string') {
        const date = new Date(currentData.publishAt);
        // Check if the date is valid
        if (!isNaN(date.getTime())) {
          return date.toISOString().slice(0, 16);
        }
      }
      
      return '';
    } catch (error) {
      console.warn('Error formatting publishAt date:', error);
      return '';
    }
  };
  
  const handlePublish = async () => {
    setPublishingStatus('publishing');
    setPublishError(null);
    
    try {
      // Prepare publish data - ensure publishAt is properly formatted
      let publishAtDate = null;
      if (currentData.publishAt) {
        if (currentData.publishAt instanceof Date) {
          publishAtDate = currentData.publishAt.toISOString();
        } else if (typeof currentData.publishAt === 'string') {
          publishAtDate = new Date(currentData.publishAt).toISOString();
        }
      }
      
      const publishData = {
        platforms: currentData.selectedPlatforms,
        coverImage: currentData.finalCoverImageFile || currentData.coverImageBase64,
        tweetThread: currentData.tweetThread,
        publishAt: publishAtDate,
        // Add other relevant data
      };
      
      console.log('Publishing article:', currentData.articleId, 'with data:', publishData);
      
      // Call the publish API
      const response = await fetch(`/api/articles/${currentData.articleId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `Failed to publish: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Publish result:', result);
      
      setPublishingStatus('success');
      
      // Clear localStorage cache for this article
      localStorage.removeItem(`publishFormState_${currentData.articleId}`);
      
      // Show success message
      toast.success('Article published successfully!');
      
      // Call the parent callback if provided, otherwise redirect after delay
      if (onPublishSuccess) {
        setTimeout(() => {
          onPublishSuccess(currentData);
        }, 1500);
      } else {
        // Fallback: redirect after a short delay
        setTimeout(() => {
          window.location.href = '/publishing';
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('Publish error:', error);
      setPublishError(error.message || t('failedToPublishArticle'));
      setPublishingStatus('error');
      toast.error(`Publish failed: ${error.message}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Publish Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
              {t('publishSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('articleTitle')}</label>
              <p className="text-sm text-muted-foreground mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">{articleTitle}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">{t('publishPlatforms')}</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {currentData.selectedPlatforms.map(platform => {
                  const platformNames = {
                    'x': tPlatforms('x.name'),
                    'wordpress': tPlatforms('wordpress.name'),
                    'note': tPlatforms('note.name')
                  };
                  return (
                    <Badge key={platform} variant={platform === 'note' ? 'default' : 'secondary'}>
                      {platformNames[platform as keyof typeof platformNames] || platform}
                      {platform === 'note' && <span className="ml-1">*</span>}
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">{t('contentSummary')}</label>
              <div className="mt-1 space-y-2 text-sm text-muted-foreground">
                {currentData.tweetThread && (
                  <p>• {t('contentSummaryItems.xThread', { count: 1 + currentData.tweetThread.thread_posts.length })}</p>
                )}
                {(currentData.finalCoverImageFile || currentData.coverImageBase64) && (
                  <p>• {t('contentSummaryItems.coverImage')}</p>
                )}
                <p>• {t('contentSummaryItems.internalNote')}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">{t('scheduledPublishTime')}</label>
              <div className="mt-1">
                <Input
                  type="datetime-local"
                  value={getPublishAtValue()}
                  onChange={(e) => updateData({ 
                    publishAt: e.target.value ? new Date(e.target.value) : null 
                  })}
                  disabled={publishingStatus === 'publishing' || publishingStatus === 'success'}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('leaveEmptyToPublishImmediately')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right: Cover Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{t('coverPreview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              {currentData.finalCoverImageFile || currentData.coverImageBase64 ? (
                <img 
                  src={currentData.finalCoverImageFile && currentData.finalCoverImageFile instanceof File
                    ? URL.createObjectURL(currentData.finalCoverImageFile)
                    : currentData.coverImageBase64 || ''
                  }
                  alt="Cover preview"
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageIcon size={48} className="mx-auto mb-2" />
                  <p className="font-medium">{t('noCoverImageSet')}</p>
                  <p className="text-xs">{t('defaultCoverWillBeUsed')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Publish Status Messages */}
      {publishingStatus === 'success' && (
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">{t('publishedSuccessfully')}</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('publishedSuccessfullyDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {publishingStatus === 'error' && publishError && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <X className="text-red-600 dark:text-red-400" size={24} />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">{t('publishFailed')}</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {publishError}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Publish Confirmation */}
      <Card className={`${publishingStatus === 'success' ? 'opacity-75' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                {publishingStatus === 'idle' && t('readyToPublish')}
                {publishingStatus === 'publishing' && t('publishingInProgress')}
                {publishingStatus === 'success' && t('publishedSuccessfully')}
                {publishingStatus === 'error' && t('publishFailed')}
                {publishingStatus === 'publishing' && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {publishingStatus === 'idle' && t('confirmDescription')}
                {publishingStatus === 'publishing' && t('publishingDescription')}
                {publishingStatus === 'success' && t('publishedDescription')}
                {publishingStatus === 'error' && t('publishFailedDescription')}
              </p>
            </div>
            <Button 
              size="lg" 
              className="px-8"
              onClick={handlePublish}
              disabled={publishingStatus === 'publishing' || publishingStatus === 'success'}
            >
              {publishingStatus === 'publishing' && t('publishingButton')}
              {publishingStatus === 'success' && t('publishedButton')}
              {(publishingStatus === 'idle' || publishingStatus === 'error') && t('publishButton')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Main Multi-Step Form Container --- 
const PublishFormSteps: React.FC<PublishFormStepsContainerProps> = ({
    articleId,
    articleTitle,
    initialState = {},
    onPublish,
    onCancel
}) => {
  const t = useTranslations('publishing.steps');
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<PublishState>(() => ({
    articleId: articleId,
    selectedPlatforms: ['note'], // Default to include Internal Note
    coverImageUrl: null,
    coverImageBase64: null,
    coverImagePrompt: '',
    coverImageStyle: '',
    referenceImageFiles: [],
    referenceImageUrls: [],
    finalCoverImageFile: null,
    generatedTweets: [],
    tweetThread: null,
    wordpressCategories: [],
    wordpressTags: [],
    publishAt: null,
    ...initialState,
  }));

  const stepsConfig = useMemo((): StepConfig[] => {
    const baseSteps: StepConfig[] = [
      { id: 'selectPlatforms', name: t('selectPlatforms') },
      { id: 'configureCoverImage', name: t('configureCoverImage') },
    ];
    if (formData.selectedPlatforms.includes('x')) {
      baseSteps.push({ id: 'adaptContentX', name: t('adaptContentX') });
    }
    if (formData.selectedPlatforms.includes('wordpress')) {
      baseSteps.push({ id: 'adaptContentWordPress', name: t('adaptContentWordPress') });
    }
    baseSteps.push({ id: 'previewAndPublish', name: t('previewAndPublish') });
    return baseSteps;
  }, [formData.selectedPlatforms, t]);

  useEffect(() => {
    localStorage.setItem(`publishFormState_${articleId}`, JSON.stringify(formData, (key, value) => {
        if (key === 'coverImageBase64') {
            return undefined; // Don't save large Base64 string
        }
        if ((key === 'referenceImageFiles' || key === 'finalCoverImageFile') && value instanceof File) {
            return undefined; 
        }  else if (key === 'referenceImageFiles' && Array.isArray(value) && value.every(item => item instanceof File)){
            return undefined;
        }
        return value;
    }));
  }, [formData, articleId]);

  useEffect(() => {
    if (Object.keys(initialState).length > 0) {
        // When initialState is provided, process publishAt field
        const processedInitialState = { ...initialState };
        if (processedInitialState.publishAt && typeof processedInitialState.publishAt === 'string') {
          try {
            processedInitialState.publishAt = new Date(processedInitialState.publishAt);
          } catch (error) {
            console.warn('Error parsing publishAt from initialState:', error);
            processedInitialState.publishAt = null;
          }
        }
        
        setFormData(prev => ({ 
          ...prev, 
          ...processedInitialState, 
          articleId: articleId, 
          referenceImageFiles: [], 
          finalCoverImageFile: null 
        }));
    } else {
        const savedStateRaw = localStorage.getItem(`publishFormState_${articleId}`);
        if (savedStateRaw) {
            try {
                const savedStateParsed = JSON.parse(savedStateRaw);
                
                // Convert publishAt string back to Date if needed
                if (savedStateParsed.publishAt && typeof savedStateParsed.publishAt === 'string') {
                  try {
                    savedStateParsed.publishAt = new Date(savedStateParsed.publishAt);
                  } catch (error) {
                    console.warn('Error parsing publishAt from localStorage:', error);
                    savedStateParsed.publishAt = null;
                  }
                }
                
                setFormData(prevDefaults => ({
                    ...prevDefaults, 
                    ...savedStateParsed, 
                    articleId: articleId, 
                    referenceImageFiles: [], 
                    finalCoverImageFile: null 
                }));
            } catch (e) { 
                console.error("Failed to parse state from localStorage", e); 
            }
        }
    }
  }, [articleId, initialState]);

  const updateData = (updates: Partial<PublishState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleStepSelect = (index: number) => {
    if (index >= 0 && index < stepsConfig.length && index !== currentStepIndex) {
        setCurrentStepIndex(index);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < stepsConfig.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
    // Note: Publishing is now handled internally by PreviewAndPublishStep component
    // which will call onPublish through the onPublishSuccess callback after successful API call
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const renderStepContent = () => {
    const currentStep = stepsConfig[currentStepIndex];
    if (!currentStep) return <div>{t('configurationError')}</div>;
    
    const componentProps: StepComponentProps = { 
      currentData: formData, 
      updateData, 
      articleTitle 
    };
    
    switch (currentStep.id) {
      case 'selectPlatforms': return <SelectPlatformsStep {...componentProps} />;
      case 'configureCoverImage': return <ConfigureCoverImageStep {...componentProps} />;
      case 'adaptContentX': return <AdaptContentXStep {...componentProps} />;
      case 'adaptContentWordPress': return <AdaptContentWordPressStep {...componentProps} />;
      case 'previewAndPublish': return (
        <PreviewAndPublishStep 
          {...componentProps} 
          onPublishSuccess={onPublish}
        />
      );
      default: return <div>{t('unknownStep')}</div>;
    }
  };
  
  const currentStepDetails = stepsConfig[currentStepIndex];

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="w-full bg-white dark:bg-slate-800 p-3 border-b dark:border-slate-700 mb-4">
          <div className="mb-2 flex-shrink-0">
            <h2 className="text-xs uppercase text-muted-foreground mb-1">{t('publishing').toUpperCase()}</h2>
            <p className="text-base font-semibold text-gray-900 dark:text-slate-100 truncate" title={articleTitle || articleId}>
              {articleTitle || (articleId ? `${t('article')}: ${articleId.substring(0,8)}...` : t('loading'))}
            </p>
          </div>
          <div className="flex-grow">
            <StepperDisplay
              stepsConfig={stepsConfig}
              currentStepIndex={currentStepIndex}
              onStepSelect={handleStepSelect}
            />
          </div>
        </div>

        {currentStepDetails && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{currentStepDetails.name}</h1>
          </div>
        )}
        <Card className="shadow-lg dark:border-slate-700">
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between p-6 border-t dark:border-slate-700">
            <Button variant="outline" onClick={onCancel}>{t('buttons.cancel')}</Button>
            <div className="flex gap-2">
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handlePrevious}>{t('buttons.previous')}</Button>
              )}
              {currentStepIndex < stepsConfig.length - 1 && (
                <Button onClick={handleNext}>{t('buttons.nextStep')}</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PublishFormSteps; 