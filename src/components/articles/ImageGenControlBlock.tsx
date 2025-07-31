'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import Image from 'next/image'; // For displaying the generated image
import { useTranslations } from 'next-intl';

// Reflects the state passed down and managed by the parent (ArticleEditorPage)
export interface ImageControlData {
  placeholderTag: string; 
  prompt: string;
  generatedImageUrl?: string;
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
  errorMessage?: string;
  // referenceImageFile?: File | null; // For future reference image upload
}

interface ImageGenControlBlockProps {
  controlData: ImageControlData;
  onPromptChange: (newPrompt: string) => void;
  onGenerateClick: () => Promise<void>; // Async function to handle generation
  // onCopyClick: () => void; // Will implement later
  // onReferenceImageChange: (file: File | null) => void; // For future use
}

const ImageGenControlBlock: React.FC<ImageGenControlBlockProps> = ({
  controlData,
  onPromptChange,
  onGenerateClick,
  // onCopyClick, 
}) => {
  const t = useTranslations('articles.imageGenControl');

  const handleGenerate = async () => {
    // onGenerateClick will be passed from parent and contain the API call logic
    // and update the state in the parent component.
    await onGenerateClick(); 
  };

  const handleCopyMarkdown = () => {
    if (controlData.status === 'succeeded' && controlData.generatedImageUrl) {
      const markdown = `![${controlData.prompt.substring(0, 30)}...](${controlData.generatedImageUrl})`;
      navigator.clipboard.writeText(markdown)
        .then(() => {
          toast.success(t('toast.markdownCopied'));
        })
        .catch(err => {
          console.error('Failed to copy markdown: ', err);
          toast.error(t('toast.copyFailed'));
        });
    } else {
      toast.error(t('toast.noImageUrl'));
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
      <Label className="text-sm font-medium text-gray-600 block mb-1">
        {t('placeholder')} {controlData.placeholderTag}
      </Label>
      <Textarea 
        value={controlData.prompt}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onPromptChange(e.target.value)}
        placeholder={t('promptPlaceholder', { tag: controlData.placeholderTag })}
        className="w-full text-sm border-gray-300 rounded-md p-2 mb-2 focus:ring-indigo-500 focus:border-indigo-500"
        rows={4} // Increased rows slightly
        disabled={controlData.status === 'loading'} // Disable textarea while loading
      />

      {/* TODO: Add Reference Image Upload Component Here */}
      {/* <div className="mb-2">
        <Label className="text-xs font-medium text-gray-500">参考图片 (可选):</Label>
        <Input type="file" className="text-xs" />
      </div> */}  

      <div className={`h-48 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 mb-2 overflow-hidden relative ${controlData.status === 'loading' ? 'animate-pulse' : ''}`}>
        {controlData.status === 'loading' && <span>{t('generating')}</span>}
        {controlData.status === 'succeeded' && controlData.generatedImageUrl && (
          <Image 
            src={controlData.generatedImageUrl} 
            alt={`Generated image for ${controlData.placeholderTag}`}
            layout="fill" 
            objectFit="contain" // Or "cover"
          />
        )}
        {controlData.status === 'failed' && <span>{t('generateFailed')}</span>}
        {controlData.status !== 'loading' && controlData.status !== 'succeeded' && controlData.status !== 'failed' && (
          <span>{t('previewArea')}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button 
          size="sm" 
          variant="default" 
          className="text-xs" 
          onClick={handleGenerate}
          disabled={controlData.status === 'loading' || !controlData.prompt.trim()} // Disable if loading or prompt is empty
        >
           {controlData.status === 'loading' ? t('generatingButton') : t('generateButton')}
        </Button>
         <Button 
           size="sm" 
           variant="outline" 
           className="text-xs" 
           onClick={handleCopyMarkdown}
           disabled={controlData.status !== 'succeeded' || !controlData.generatedImageUrl}
          >
           {t('copyMarkdown')}
        </Button>
      </div>

      {/* Display detailed error message if generation failed */} 
      {controlData.status === 'failed' && controlData.errorMessage && (
          <p className='text-xs text-red-500 mt-1'>{t('reasonLabel')} {controlData.errorMessage}</p>
      )}
    </div>
  );
};

export default ImageGenControlBlock; 