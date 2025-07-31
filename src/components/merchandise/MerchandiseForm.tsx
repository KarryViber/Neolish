import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import { Ban, Save, Loader2, Package, FileText, Link2, FileUp, Pencil, TagsIcon, Type, Info as InfoIcon, ClipboardList, UserCircle2, CalendarDays, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface MerchandiseFormData {
  id?: string;
  name: string;
  summary: string;
  source: string; 
  sourceType: 'url' | 'file' | 'manual';
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  user?: {
    username: string;
  };
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder, disabled = false }) => {
  const t = useTranslations('merchandise');
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleInputBlur = () => {
    const newTag = inputValue.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInputValue('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center">
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(tag)} 
              className="ml-1.5 p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              aria-label={t('tagInput.removeLabel', { tag })}
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        placeholder={placeholder || t('tagInput.placeholder')}
        className="w-full"
        disabled={disabled}
      />
    </div>
  );
};

interface MerchandiseFormProps {
  onSubmit: (data: MerchandiseFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: MerchandiseFormData | null;
  isEditMode: boolean;
  isProcessing?: boolean;
  isViewMode?: boolean;
}

const MerchandiseForm: React.FC<MerchandiseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditMode,
  isProcessing = false,
  isViewMode = false,
}) => {
  const t = useTranslations('merchandise');
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [source, setSource] = useState('');
  const [sourceType, setSourceType] = useState<'url' | 'file' | 'manual'>('manual');
  const [tags, setTags] = useState<string[]>([]);
  const [isInternalViewMode, setIsInternalViewMode] = useState(isViewMode);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSummary(initialData.summary || '');
      setSource(initialData.source || '');
      setSourceType(initialData.sourceType || 'manual');
      setTags(initialData.tags || []);
    } else {
      setName('');
      setSummary('');
      setSource('');
      setSourceType('manual');
      setTags([]);
    }
  }, [initialData]);

  useEffect(() => {
    setIsInternalViewMode(isViewMode);
  }, [isViewMode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error(t('form.validation.nameRequired'));
      return;
    }
    const formData: MerchandiseFormData = {
      name: name.trim(),
      summary: summary.trim(),
      source: source.trim(),
      sourceType,
      tags,
    };
    if (isEditMode && initialData?.id) {
      formData.id = initialData.id;
    }
    await onSubmit(formData);
  };

  const getSourceTypeIcon = (type: 'url' | 'file' | 'manual') => {
    switch (type) {
      case 'url':
        return <Link2 size={14} className="mr-1.5 text-blue-600" />;
      case 'file':
        return <FileUp size={14} className="mr-1.5 text-green-600" />;
      case 'manual':
        return <Pencil size={14} className="mr-1.5 text-purple-600" />;
    }
  };

  const getSourceLabel = () => {
    switch (sourceType) {
      case 'url':
        return t('form.source.labels.url');
      case 'file':
        return t('form.source.labels.file');
      case 'manual':
        return t('form.source.labels.manual');
    }
  };

  const getSourcePlaceholder = () => {
    switch (sourceType) {
      case 'url':
        return t('form.source.placeholders.url');
      case 'file':
        return t('form.source.placeholders.file');
      case 'manual':
        return t('form.source.placeholders.manual');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full" id="merchandiseForm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-1 overflow-hidden">
        {/* Column 1 - 左侧信息栏 (2/5宽度) */}
        <div className="md:col-span-2 space-y-6 pr-4 overflow-y-auto">
          <div>
            <Label htmlFor="name" className="text-gray-700 flex items-center">
              <Type size={14} className="mr-1.5 text-blue-600" /> {t('form.name.label')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('form.name.placeholder')}
              required
              disabled={isProcessing}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label htmlFor="source" className="text-gray-700 flex items-center">
              {getSourceTypeIcon(sourceType)}
              {t('form.source.label')} <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={getSourcePlaceholder()}
              required
              disabled={isProcessing}
              className="mt-1 w-full"
            />
          </div>

          <div>
            <Label htmlFor="tags" className="text-gray-700 flex items-center">
              <TagsIcon size={14} className="mr-1.5 text-orange-600" /> {t('form.tags.label')}
            </Label>
            <div className="mt-1">
              <TagInput 
                value={tags}
                onChange={setTags}
                placeholder={t('form.tags.placeholder')}
                disabled={isProcessing}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 px-1">
              {t('tagInput.hint')}
            </p>
          </div>

          {/* Metadata section for edit mode */}
          {isEditMode && initialData && (
            <div>
              <Label className="text-gray-700 flex items-center">
                <InfoIcon size={14} className="mr-1.5 text-gray-600" /> {t('form.metadata.label')}
              </Label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-md border space-y-2">
                {initialData.user?.username && (
                  <div className="flex items-center text-xs">
                    <UserCircle2 size={12} className="mr-1.5 text-sky-600 dark:text-sky-400" />
                    <span className="text-gray-500 dark:text-slate-400">{t('form.metadata.createdBy')}:</span>
                    <span className="ml-1 font-medium text-gray-700 dark:text-slate-200">{initialData.user.username}</span>
                  </div>
                )}
                {initialData.createdAt && (
                  <div className="flex items-center text-xs">
                    <CalendarDays size={12} className="mr-1.5 text-green-600 dark:text-green-400" />
                    <span className="text-gray-500 dark:text-slate-400">{t('form.metadata.created')}:</span>
                    <span className="ml-1 font-medium text-gray-700 dark:text-slate-200">{new Date(initialData.createdAt).toLocaleDateString('en-CA')}</span>
                  </div>
                )}
                {initialData.updatedAt && (
                  <div className="flex items-center text-xs">
                    <CalendarDays size={12} className="mr-1.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-500 dark:text-slate-400">{t('form.metadata.updated')}:</span>
                    <span className="ml-1 font-medium text-gray-700 dark:text-slate-200">{new Date(initialData.updatedAt).toLocaleDateString('en-CA')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Column 2 - 摘要部分 (3/5宽度) */}
        <div className="md:col-span-3 flex flex-col">
          <Label htmlFor="summary" className="text-gray-700 flex items-center mb-2 flex-shrink-0">
            <FileText size={14} className="mr-1.5 text-green-600" /> {t('form.summary.label')}
          </Label>
          <div className="flex-1" style={{ height: 'calc(100vh - 220px)', maxHeight: 'calc(90vh - 220px)' }}>
            <MarkdownEditor
              value={summary}
              onChange={setSummary}
              placeholder={t('form.summary.placeholder')}
              height="100%"
              disabled={isProcessing}
              className="h-full"
              showToolbar={!isInternalViewMode}
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

export default MerchandiseForm; 