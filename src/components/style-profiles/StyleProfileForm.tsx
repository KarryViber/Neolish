import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { Ban, Save, Loader2, Type, FileText as InfoIcon, UserCircle2 as AuthorIcon, Wand2, Quote as SampleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface StyleProfileFormData {
  id?: string;
  name: string;
  description?: string | null;
  authorInfo?: string | null;
  styleFeatures?: string | null;
  sampleText?: string | null;
}

interface StyleProfileFormProps {
  onSubmit: (data: StyleProfileFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: StyleProfileFormData | null;
  isEditMode: boolean;
  isProcessing?: boolean;
  isViewMode?: boolean;
}

const StyleProfileForm: React.FC<StyleProfileFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditMode,
  isProcessing = false,
  isViewMode = false,
}) => {
  const t = useTranslations('style-profiles');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [authorInfoText, setAuthorInfoText] = useState('');
  const [styleFeaturesText, setStyleFeaturesText] = useState('');
  const [sampleText, setSampleText] = useState('');
  const [isInternalViewMode, setIsInternalViewMode] = useState(isViewMode);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setAuthorInfoText(initialData.authorInfo || '');
      setStyleFeaturesText(initialData.styleFeatures || '');
      setSampleText(initialData.sampleText || '');
    } else {
      setName('');
      setDescription('');
      setAuthorInfoText('');
      setStyleFeaturesText('');
      setSampleText('');
    }
  }, [initialData]);

  useEffect(() => {
    setIsInternalViewMode(isViewMode);
  }, [isViewMode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error(t('toast.nameRequired'));
      return;
    }
    const formData: StyleProfileFormData = {
      name: name.trim(),
      description: description?.trim() || null,
      authorInfo: authorInfoText?.trim() || null,
      styleFeatures: styleFeaturesText?.trim() || null,
      sampleText: sampleText?.trim() || null,
    };
    if (isEditMode && initialData?.id) {
      formData.id = initialData.id;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full" id="styleProfileForm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto pr-2 min-h-0">
        {/* Column 1 */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-700 flex items-center">
              <Type size={14} className="mr-1.5 text-blue-600" /> {t('form.name.label')} {!isInternalViewMode && <span className="text-red-500 ml-1">{t('form.name.required')}</span>}
            </Label>
            {isInternalViewMode ? (
              <div className="mt-1 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md border">
                <p className="text-sm text-gray-800 dark:text-slate-200">{name || t('form.name.noName')}</p>
              </div>
            ) : (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('form.name.placeholder')}
                required
                disabled={isProcessing}
                className="mt-1 w-full"
              />
            )}
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-700 flex items-center">
              <InfoIcon size={14} className="mr-1.5 text-green-600" /> {t('form.description.label')}
            </Label>
            {isInternalViewMode ? (
              <div className="mt-1 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md border max-h-24 overflow-y-auto">
                <p className="text-sm text-gray-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {description || t('form.description.noDescription')}
                </p>
              </div>
            ) : (
              <Textarea
                id="description"
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.description.placeholder')}
                rows={4}
                disabled={isProcessing}
                className="mt-1 w-full resize-y"
              />
            )}
          </div>
           <div>
            <Label htmlFor="authorInfo" className="text-gray-700 flex items-center">
              <AuthorIcon size={14} className="mr-1.5 text-purple-600" /> {t('form.authorInfo.label')}
            </Label>
            <MarkdownEditor
              value={authorInfoText}
              onChange={setAuthorInfoText}
              placeholder={t('form.authorInfo.placeholder')}
              height="240px"
              disabled={isProcessing}
              showToolbar={false}
              hidePreviewToggle={true}
              initialPreviewMode={isInternalViewMode}
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="styleFeatures" className="text-gray-700 flex items-center">
              <Wand2 size={14} className="mr-1.5 text-orange-600" /> {t('form.styleFeatures.label')}
            </Label>
            <MarkdownEditor
              value={styleFeaturesText}
              onChange={setStyleFeaturesText}
              placeholder={t('form.styleFeatures.placeholder')}
              height="240px"
              disabled={isProcessing}
              showToolbar={false}
              hidePreviewToggle={true}
              initialPreviewMode={isInternalViewMode}
            />
          </div>
          <div>
            <Label htmlFor="sampleText" className="text-gray-700 flex items-center">
              <SampleIcon size={14} className="mr-1.5 text-teal-600" /> {t('form.sampleText.label')}
            </Label>
            <MarkdownEditor
              value={sampleText || ''}
              onChange={setSampleText}
              placeholder={t('form.sampleText.placeholder')}
              height="240px"
              disabled={isProcessing}
              showToolbar={false}
              hidePreviewToggle={true}
              initialPreviewMode={isInternalViewMode}
            />
          </div>
        </div>
      </div>
      
      {/* 移除所有内部按钮，现在统一在Dialog外部处理 */}
    </form>
  );
};

export default StyleProfileForm; 