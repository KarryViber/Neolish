console.log("StyleProfileForm.tsx module loaded - Test 123"); // Unique message

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Ban } from 'lucide-react'; // Assuming Ban is for Cancel
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

// Matches the structure of StyleProfile from Prisma, with Json fields potentially being null
// We expect authorInfo and styleFeatures to be strings after the backend transformation
// but initialData might contain old JsonValue format before migration and form display.
interface StyleProfileFormData {
  id?: string;
  name: string;
  description?: string | null;
  authorInfo?: string | null; // Expected to be a string now from DB
  styleFeatures?: string | null; // Expected to be a string now from DB
  sampleText?: string | null;
  // sourceUrl?: string | null; // Not directly edited in this form
}

interface StyleProfileFormProps {
  onSubmit: (data: StyleProfileFormData) => Promise<void>;
  onCancel?: () => void; // Optional: if there's a cancel button in the dialog
  initialData?: StyleProfileFormData | null;
  isEditMode: boolean;
  isLoading?: boolean; // To show loading state on submit button
  // Removed isOpen from here, as it's usually managed by the parent Dialog
}

const StyleProfileForm: React.FC<StyleProfileFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditMode,
  isLoading = false,
}) => {
  const t = useTranslations('style-profiles.form');
  const tCommon = useTranslations('common');
  const tToast = useTranslations('style-profiles.toast');
  
  // Log props at the very beginning of the component function body
  console.log("StyleProfileForm rendered/re-rendered. isEditMode:", isEditMode, "initialData exists:", !!initialData);
  if (initialData) {
    console.log("StyleProfileForm initialData (at component top):", JSON.stringify(initialData, null, 2));
  }

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [authorInfoText, setAuthorInfoText] = useState('');
  const [styleFeaturesText, setStyleFeaturesText] = useState('');
  const [sampleText, setSampleText] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("StyleProfileForm initialData:", JSON.stringify(initialData, null, 2)); // DEBUG LOG
      setName(initialData.name || '');
      setDescription(initialData.description || '');

      const newAuthorInfo = initialData.authorInfo || '';
      const newStyleFeatures = initialData.styleFeatures || '';

      setAuthorInfoText(newAuthorInfo);
      setStyleFeaturesText(newStyleFeatures);
      setSampleText(initialData.sampleText || '');

      // Log the state values immediately after setting them
      console.log("StyleProfileForm after set states - authorInfoText:", newAuthorInfo);
      console.log("StyleProfileForm after set states - styleFeaturesText:", newStyleFeatures);

    } else {
      // Reset form for new profile creation or if initialData is not available
      setName('');
      setDescription('');
      setAuthorInfoText('');
      setStyleFeaturesText('');
      setSampleText('');
    }
    console.log("StyleProfileForm initialData (useEffect):", JSON.stringify(initialData, null, 2));
  // Watch initialData directly. If the parent Dialog re-fetches or provides new initialData
  // for the same "edit mode" instance, the form should update.
  // isEditMode change should also trigger re-evaluation.
  }, [isEditMode, initialData]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      // Basic validation, consider a more robust solution if needed (e.g., react-hook-form)
      toast.error(tToast('nameRequired'));
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

  // Unconditional log before return to see if function body executes to this point
  console.log("StyleProfileForm: Reaching end of function body before return. isEditMode:", isEditMode, "Name state:", name);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow overflow-y-auto pr-2">
        {/* Column 1 */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-700">{t('name.label')} <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('name.placeholder')}
              required
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-700">{t('description.label')}</Label>
            <Textarea
              id="description"
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('description.placeholder')}
              rows={3}
              className="mt-1 w-full"
            />
          </div>
           <div>
            <Label htmlFor="authorInfo" className="text-gray-700">{t('authorInfo.label')}</Label>
            <Textarea
              id="authorInfo"
              value={authorInfoText}
              onChange={(e) => setAuthorInfoText(e.target.value)}
              placeholder={t('authorInfo.placeholder')}
              rows={8}
              className="mt-1 w-full"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="styleFeatures" className="text-gray-700">{t('styleFeatures.label')}</Label>
            <Textarea
              id="styleFeatures"
              value={styleFeaturesText}
              onChange={(e) => setStyleFeaturesText(e.target.value)}
              placeholder={t('styleFeatures.placeholder')}
              rows={8}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label htmlFor="sampleText" className="text-gray-700">{t('sampleText.label')}</Label>
            <Textarea
              id="sampleText"
              value={sampleText || ''}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder={t('sampleText.placeholder')}
              rows={8}
              className="mt-1 w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200 flex justify-end items-center space-x-3 sticky bottom-0 bg-white pb-1 z-10">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex items-center">
            <Ban size={16} className="mr-2" /> {tCommon('cancel')}
          </Button>
        )}
        <Button type="submit" disabled={isLoading || !name.trim()} className="flex items-center">
          {isLoading ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
          {isEditMode ? tCommon('save') + ' Changes' : tCommon('create') + ' Profile'}
        </Button>
      </div>
    </form>
  );
};

export default StyleProfileForm; 