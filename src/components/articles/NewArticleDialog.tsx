'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox"; // For multi-select if needed
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge"; // For displaying custom purposes
import { X as XIcon, ListChecks, Palette, Users, Target, Plus, Ban, FilePlus } from 'lucide-react'; // Added more icons
import { Prisma } from '@prisma/client'; // For potential Prisma types if needed
import { useSession } from "next-auth/react"; // Import useSession
import { useTranslations } from 'next-intl';

// Define the structure for an audience within an outline, matching backend's ApiAudienceInOutline
interface DialogAudienceInOutline { // Renamed to avoid conflict if imported elsewhere
  id: string;
  name: string;
  description: string | null;
  tags: string[];
  type: string | null;
}

interface DialogOutlineAudienceLink { // Renamed
  audience: DialogAudienceInOutline;
}

// Define the structure for an outline, matching backend's ApiOutlineWithDetails
interface DialogOutlineWithDetails { // Renamed
  id: string;
  title: string;
  content: string | null; // content from outline model
  userKeyPoints: string | null; // userKeyPoints from outline model
  styleProfileId: string;
  styleProfile: { id: string; name: string } | null; // Include id for Style Profile
  outlineAudiences: DialogOutlineAudienceLink[];
  updatedAt: Date; // Or string if it's serialized as string
  createdAt: Date; // Added from API
  merchandiseId: string | null; // Added from API
  merchandise: { id: string; name: string; tags?: string[] } | null; // Updated to include tags
  user?: { username?: string }; // Added from API
}

interface DisplayTag {
  id: string;
  label: string;
  type: 'predefined' | 'custom';
}

interface NewArticleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated: () => void;
}

// Replace Mock function with actual API call structure
async function fetchOutlinesFromAPI(): Promise<DialogOutlineWithDetails[]> { // Use new interface
  console.log("Fetching outlines from API for NewArticleDialog...");
  try {
    const response = await fetch('/api/outlines');
    if (!response.ok) {
      throw new Error(`Failed to fetch outlines: ${response.statusText}`);
    }
    const data = await response.json();
    return data as DialogOutlineWithDetails[]; // Cast to new interface
  } catch (error) {
    console.error("API Error fetching outlines in NewArticleDialog:", error);
    throw error;
  }
}

const NewArticleDialog: React.FC<NewArticleDialogProps> = ({ isOpen, onClose, onArticleCreated }) => {
  const t = useTranslations('articles');
  const tCommon = useTranslations('common');
  
  const [outlines, setOutlines] = useState<DialogOutlineWithDetails[]>([]); // Use new interface
  const [selectedOutlineId, setSelectedOutlineId] = useState<string | undefined>(undefined);
  const [derivedStyleProfileName, setDerivedStyleProfileName] = useState<string>('');
  const [recommendedAudienceNames, setRecommendedAudienceNames] = useState<string[]>([]); // Changed state name for clarity
  const [selectedAudience, setSelectedAudience] = useState<string | undefined>(undefined);
  const [customAudience, setCustomAudience] = useState<string>('');
  const [derivedMerchandise, setDerivedMerchandise] = useState<{ id: string; name: string; tags?: string[] } | null>(null); // New state for merchandise
  
  const [selectedPredefinedPurposeIds, setSelectedPredefinedPurposeIds] = useState<string[]>([]);
  const [customPurposeInput, setCustomPurposeInput] = useState<string>('');
  const [addedCustomPurposes, setAddedCustomPurposes] = useState<string[]>([]);

  const [isLoadingOutlines, setIsLoadingOutlines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession(); // Get session data

  // 将 predefinedPurposes 包装在 useMemo 中以避免每次渲染时重新创建
  const predefinedPurposes = useMemo(() => [
    { id: 'awareness', label: t('newArticle.form.writingPurpose.predefined.awareness') },
    { id: 'leadgen', label: t('newArticle.form.writingPurpose.predefined.leadgen') },
    { id: 'education', label: t('newArticle.form.writingPurpose.predefined.education') },
    { id: 'branding', label: t('newArticle.form.writingPurpose.predefined.branding') },
    { id: 'sales', label: t('newArticle.form.writingPurpose.predefined.sales') },
    { id: 'retention', label: t('newArticle.form.writingPurpose.predefined.retention') },
    { id: 'seo', label: t('newArticle.form.writingPurpose.predefined.seo') },
    { id: 'recruitment', label: t('newArticle.form.writingPurpose.predefined.recruitment') },
  ], [t]);

  const purposeOptions = useMemo(() => {
    return predefinedPurposes.map(purpose => ({
      value: purpose.id,
      label: purpose.label
    }));
  }, [predefinedPurposes]);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingOutlines(true);
      setOutlines([]); 
      fetchOutlinesFromAPI()
        .then(data => {
          setOutlines(data);
        })
        .catch(error => {
          toast.error(t('newArticle.toast.outlinesFailed'));
        })
        .finally(() => {
          setIsLoadingOutlines(false);
        });
      // Reset form fields when dialog opens
      setSelectedOutlineId(undefined);
      setDerivedStyleProfileName('');
      setRecommendedAudienceNames([]);
      setSelectedAudience(undefined);
      setCustomAudience('');
      setSelectedPredefinedPurposeIds([]);
      setCustomPurposeInput('');
      setAddedCustomPurposes([]);
      setIsSubmitting(false);
    }
  }, [isOpen, t]);

  useEffect(() => {
    const selected = outlines.find(o => o.id === selectedOutlineId);
    if (selected) {
      setDerivedStyleProfileName(selected.styleProfile?.name || 'N/A');
      const audienceNames = selected.outlineAudiences?.map(oaLink => oaLink.audience.name) || [];
      setRecommendedAudienceNames(audienceNames);
      setDerivedMerchandise(selected.merchandise || null); // Set derived merchandise
      setSelectedAudience(undefined); 
      setCustomAudience('');
    } else {
      setDerivedStyleProfileName('');
      setRecommendedAudienceNames([]);
      setDerivedMerchandise(null); // Clear derived merchandise
    }
  }, [selectedOutlineId, outlines]);

  const handlePredefinedPurposeToggle = (purposeId: string) => {
    setSelectedPredefinedPurposeIds(prev =>
      prev.includes(purposeId) ? prev.filter(id => id !== purposeId) : [...prev, purposeId]
    );
  };

  const handleAddCustomPurpose = () => {
    const newPurpose = customPurposeInput.trim();
    if (newPurpose && !addedCustomPurposes.includes(newPurpose)) {
      setAddedCustomPurposes(prev => [...prev, newPurpose]);
      setCustomPurposeInput('');
    } else if (!newPurpose) {
        toast.info(t('newArticle.form.writingPurpose.customEmpty'));
    } else {
        toast.info(t('newArticle.form.writingPurpose.customExists').replace('{purpose}', newPurpose));
    }
  };

  const displayedPurposeTags: DisplayTag[] = useMemo(() => {
    const predefinedTags = selectedPredefinedPurposeIds.map(id => {
      const purpose = predefinedPurposes.find(p => p.id === id);
      return { id: purpose!.id, label: purpose!.label, type: 'predefined' as const };
    });
    const customTags = addedCustomPurposes.map(label => (
      { id: label, label: label, type: 'custom' as const }
    ));
    return [...predefinedTags, ...customTags];
  }, [selectedPredefinedPurposeIds, addedCustomPurposes, predefinedPurposes]);

  const handleRemovePurposeTag = (tag: DisplayTag) => {
    if (tag.type === 'predefined') {
      handlePredefinedPurposeToggle(tag.id);
    } else if (tag.type === 'custom') {
      setAddedCustomPurposes(prev => prev.filter(p => p !== tag.label));
    }
  };

  const handleSubmit = async () => {
    if (!selectedOutlineId) {
      toast.error(t('newArticle.validation.selectOutline'));
      return;
    }
    
    // 修复audience逻辑：如果选择了custom，使用customAudience；否则使用selectedAudience
    let finalAudience: string;
    if (selectedAudience === 'custom') {
      if (!customAudience.trim()) {
        toast.error(t('newArticle.validation.enterCustomAudience'));
        return;
      }
      finalAudience = customAudience.trim();
    } else if (selectedAudience) {
      finalAudience = selectedAudience;
    } else {
      toast.error(t('newArticle.validation.selectOrEnterAudience'));
      return;
    }

    if (displayedPurposeTags.length === 0) {
      toast.error(t('newArticle.validation.selectPurpose'));
      return;
    }

    const teamId = session?.user?.teams?.[0]?.id;

    if (!teamId) {
      toast.error("Team information is missing. You might need to re-login or ensure you are part of a team.");
      setIsSubmitting(false);
        return;
    }

    setIsSubmitting(true);
    console.log("NewArticleDialog: handleSubmit started."); 
    try {
      const apiPayload = {
        outlineId: selectedOutlineId,
        targetAudience: finalAudience, 
        predefinedPurposeIds: selectedPredefinedPurposeIds,
        customPurposeTexts: addedCustomPurposes,
        teamId: teamId, // Add teamId to the payload
      };
      console.log("NewArticleDialog: Calling fetch /api/articles with payload:", apiPayload);

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });
      console.log(`NewArticleDialog: Fetch response status: ${response.status}`);

      if (response.ok) { 
        const result = await response.json();
        console.log("NewArticleDialog: Article creation API response:", result);

        toast.success(t('newArticle.toast.createSuccess'));
        onArticleCreated();
        onClose();
      } else {
        console.log(`NewArticleDialog: Handling !response.ok (status: ${response.status}).`);
        let errorMsg = "Operation failed. Please try again.";
        try {
            const errorData = await response.json(); 
            console.log("NewArticleDialog: Parsed error JSON from API:", errorData);
            errorMsg = errorData.error || errorData.message || errorMsg; 
        } catch (e) {
            console.warn("NewArticleDialog: Failed to parse error JSON from API response. Status text:", response.statusText, e);
            errorMsg = `Operation failed: ${response.statusText || 'Server error'} (Status ${response.status})`;
        }
        console.error("NewArticleDialog: Throwing error for !response.ok:", errorMsg);
        toast.error(errorMsg); 
      }
    } catch (error: any) { 
      console.error("NewArticleDialog: Error creating article:", error);
      toast.error(t('newArticle.toast.createFailed'));
    } finally {
      setIsSubmitting(false);
      console.log("NewArticleDialog: handleSubmit finished.");
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] p-6 flex flex-col max-h-[90vh]">
        <DialogHeader className="mb-4 flex-shrink-0">
          <DialogTitle>{t('newArticle.title')}</DialogTitle>
          <DialogDescription>
            {t('newArticle.description')}
          </DialogDescription>
        </DialogHeader>

        {/* Main content area using Grid for two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 flex-grow overflow-y-auto pr-2"> 
          {/* Left Column - Sections always visible */}
          <div className="space-y-6">
            {/* Outline Selection */}
            <div>
              <Label htmlFor="outline-select" className="font-semibold flex items-center">
                <ListChecks size={14} className="mr-1.5 text-blue-600" /> 1. {t('newArticle.form.selectOutline.label')} <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select value={selectedOutlineId} onValueChange={setSelectedOutlineId} disabled={isLoadingOutlines}>
                <SelectTrigger id="outline-select" className="mt-1">
                  <SelectValue placeholder={isLoadingOutlines ? t('newArticle.loading.outlines') : t('newArticle.form.selectOutline.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {outlines.map((outline) => (
                    <SelectItem key={outline.id} value={outline.id}>{outline.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style Profile (Derived) - Always visible, readOnly */}
            <div>
              <Label className="font-semibold flex items-center">
                <Palette size={14} className="mr-1.5 text-amber-600" /> 2. {t('newArticle.form.styleProfile.label')}
              </Label>
              <Input 
                value={selectedOutlineId ? derivedStyleProfileName : t('newArticle.form.selectOutline.placeholder')} 
                readOnly 
                className={`mt-1 bg-gray-100 ${!selectedOutlineId ? 'text-gray-500' : ''}`}
              />
              {selectedOutlineId && (
                <p className="text-xs text-gray-500 mt-1">{t('newArticle.form.styleProfile.derived')}</p>
              )}
            </div>

            {/* Derived Merchandise - Readonly - NEW SECTION */}
            {derivedMerchandise && (
              <div className="mb-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <ListChecks size={16} className="mr-2 text-green-500" /> {t('newArticle.form.merchandise.label')}
                </Label>
                <p className="mt-2 text-sm text-gray-900 dark:text-gray-100 pl-2 py-1 font-semibold">
                  {derivedMerchandise.name}
                </p>
                {derivedMerchandise.tags && derivedMerchandise.tags.length > 0 && (
                  <div className="mt-1 pl-2 flex flex-wrap gap-2">
                    {derivedMerchandise.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">{t('newArticle.form.merchandise.derived')}</p>
              </div>
            )}

            {/* Audience Selection - Always visible, disabled until outline selected */}
            <div>
              <Label htmlFor="audience-select" className="font-semibold flex items-center">
                <Users size={14} className="mr-1.5 text-sky-600" /> 3. {t('newArticle.form.targetAudience.label')} <span className="text-red-500 ml-1">*</span>
              </Label>
              <Select 
                value={selectedAudience} 
                onValueChange={(value) => {
                  setSelectedAudience(value);
                  // 如果选择的不是custom，清空自定义输入
                  if (value !== 'custom') {
                    setCustomAudience('');
                  }
                }} 
                disabled={!selectedOutlineId} // Disable if no outline selected
              >
                <SelectTrigger id="audience-select" className="mt-1">
                  <SelectValue placeholder={!selectedOutlineId ? t('newArticle.form.selectOutline.placeholder') : t('newArticle.form.targetAudience.selectOrCustom')} />
                </SelectTrigger>
                <SelectContent>
                  {/* 添加Custom选项作为第一个选项 */}
                  <SelectItem value="custom">{t('newArticle.form.targetAudience.custom')}</SelectItem>
                  {recommendedAudienceNames.map((name, index) => (
                    <SelectItem key={`${name}-${index}`} value={name}>
                      <span className="text-sm text-gray-600">{t('newArticle.form.targetAudience.recommended')}</span> {name}
                    </SelectItem>
                  ))}
                  {selectedOutlineId && recommendedAudienceNames.length === 0 && (
                     <div className="px-2 py-1.5 text-sm text-muted-foreground">{t('newArticle.form.merchandise.none')}</div>
                  )}
                </SelectContent>
              </Select>
              {/* 只有选择了custom时才显示输入框 */}
              {selectedAudience === 'custom' && (
                <Input 
                  type="text" 
                  placeholder={t('newArticle.form.targetAudience.customPlaceholder')} 
                  value={customAudience} 
                  onChange={(e) => setCustomAudience(e.target.value)}
                  className="mt-2"
                  disabled={!selectedOutlineId}
                />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 flex flex-col">
            {/* Purpose Selection */}
            <div>
              <Label htmlFor="purpose-tags" className="font-semibold flex items-center">
                <Target size={14} className="mr-1.5 text-green-600" /> 4. {t('newArticle.form.writingPurpose.label')} <span className="text-red-500 ml-1">*</span>
              </Label>
              <p className="text-sm text-gray-600 mt-1">{t('newArticle.form.writingPurpose.description')}</p>
              
              {/* Selected Tags Display - Always visible */}
              <div className="mt-2 mb-3 flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50 min-h-[40px]">
                {displayedPurposeTags.length === 0 && (
                  <span className="text-sm text-gray-400 italic">No purposes selected yet.</span>
                )}
                {displayedPurposeTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                    {tag.label}
                    <button onClick={() => handleRemovePurposeTag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-gray-300">
                      <XIcon size={12} />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Predefined Purpose Options */}
              <div className="mt-1 grid grid-cols-2 gap-3">
                {predefinedPurposes.map((purpose) => (
                  <button 
                    key={purpose.id} 
                    onClick={() => handlePredefinedPurposeToggle(purpose.id)} 
                    className={`p-3 border rounded-lg text-left transition-colors ${selectedPredefinedPurposeIds.includes(purpose.id) ? 'bg-indigo-100 border-indigo-300' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                  >
                    <p className="font-medium text-sm">{purpose.label}</p>
                  </button>
                ))}
              </div>

              {/* Custom Purpose Input */}
              <div className="mt-4 flex gap-2">
                <Input
                  type="text"
                  placeholder={t('newArticle.form.writingPurpose.customInput')}
                  value={customPurposeInput}
                  onChange={(e) => setCustomPurposeInput(e.target.value)}
                  className="flex-grow"
                />
                <Button type="button" variant="outline" onClick={handleAddCustomPurpose} className="flex items-center">
                  <Plus size={16} className="mr-1.5" /> {t('newArticle.form.writingPurpose.addCustom')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer outside the grid, positioned at the bottom */}
        <DialogFooter className="mt-6 flex-shrink-0 pt-4 border-t justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex items-center">
            <Ban size={16} className="mr-2" /> {t('newArticle.buttons.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={
              isSubmitting || 
              isLoadingOutlines || 
              !selectedOutlineId || 
              !selectedAudience ||
              (selectedAudience === 'custom' && !customAudience.trim()) ||
              displayedPurposeTags.length === 0
            } 
            className="flex items-center"
          >
            <FilePlus size={16} className="mr-2" /> {isSubmitting ? t('newArticle.loading.creating') : t('newArticle.buttons.create')}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default NewArticleDialog; 