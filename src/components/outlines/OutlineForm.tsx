'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import MarkdownEditor from '@/components/ui/MarkdownEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StyleProfile, Outline as PrismaOutline, Audience as PrismaAudience, Merchandise } from '@prisma/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Ban, Save, Wand2, Type as TitleIcon, Palette as StyleProfileIcon, Package as MerchandiseIcon, ListChecks as KeyPointsIcon, FileText as ContentIcon, Edit2, Users, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AudienceDetailsDialog from './AudienceDetailsDialog';

type FetchedStyleProfile = Pick<StyleProfile, 'id' | 'name'>
type FetchedMerchandise = Pick<Merchandise, 'id' | 'name'>

type AudienceInOutline = PrismaAudience
interface OutlineAudienceLink {
  audience: AudienceInOutline;
}

export interface OutlineDataForForm extends Omit<PrismaOutline, 'content'> {
  content?: string | null;
  styleProfile?: Pick<StyleProfile, 'name'> | null;
  outlineAudiences?: OutlineAudienceLink[];
  merchandise?: Pick<Merchandise, 'name'> | null;
}

export interface GeneratedOutline extends PrismaOutline {
  styleProfile?: Pick<StyleProfile, 'name'> | null; 
  merchandise?: Pick<Merchandise, 'name'> | null;
  outlineAudiences?: OutlineAudienceLink[];
}

interface OutlineFormProps {
  editingOutline: OutlineDataForForm | null;
  onSuccess: (generatedOutline?: GeneratedOutline) => void;
  onCancel: () => void;
  isParentGenerating?: boolean;
  onGenerationStart?: () => void;
  isViewMode?: boolean;
}

export default function OutlineForm({ editingOutline, onSuccess, onCancel, isParentGenerating, onGenerationStart, isViewMode = false }: OutlineFormProps) {
  const { data: session } = useSession();
  const t = useTranslations('outlines');
  const [title, setTitle] = useState('');
  const [userKeyPoints, setUserKeyPoints] = useState('');
  const [selectedStyleProfileId, setSelectedStyleProfileId] = useState('');
  const [editableContent, setEditableContent] = useState<string>('');
  const [selectedMerchandiseId, setSelectedMerchandiseId] = useState<string>('');
  
  const [styleProfiles, setStyleProfiles] = useState<FetchedStyleProfile[]>([]);
  const [merchandiseItems, setMerchandiseItems] = useState<FetchedMerchandise[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState<boolean>(true);
  const [isLoadingMerchandise, setIsLoadingMerchandise] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isInternalViewMode, setIsInternalViewMode] = useState(isViewMode);

  // 添加受众弹窗状态管理
  const [isAudienceDialogOpen, setIsAudienceDialogOpen] = useState(false);

  const keyPointsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const keyPointsNewTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditMode = !!editingOutline;

  useEffect(() => {
    if (editingOutline) {
      setTitle(editingOutline.title || '');
      setUserKeyPoints(editingOutline.userKeyPoints || ''); 
      setSelectedStyleProfileId(editingOutline.styleProfileId || '');
      setEditableContent(editingOutline.content || '');
      setSelectedMerchandiseId(editingOutline.merchandiseId || '');
    } else {
      setTitle('');
      setUserKeyPoints('');
      setSelectedStyleProfileId('');
      setEditableContent('');
      setSelectedMerchandiseId('');
    }
  }, [editingOutline]);

  useEffect(() => {
    setIsInternalViewMode(isViewMode);
  }, [isViewMode]);

  const loadStyleProfiles = useCallback(async () => {
    setIsLoadingProfiles(true);
    try {
      const response = await fetch('/api/style-profiles');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch style profiles' }));
        throw new Error(errorData.message || t('toast.fetchStyleProfilesError'));
      }
      const profilesData: StyleProfile[] = await response.json();
      const formattedProfiles = profilesData.map(p => ({ id: p.id, name: p.name }));
      setStyleProfiles(formattedProfiles);
    } catch (error: any) {
      toast.error(error.message || t('toast.fetchStyleProfilesError'));
      setStyleProfiles([]);
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [t]);

  const loadMerchandiseItems = useCallback(async () => {
    setIsLoadingMerchandise(true);
    try {
      const response = await fetch('/api/merchandise');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch merchandise' }));
        throw new Error(errorData.message || t('toast.fetchMerchandiseError'));
      }
      const merchandiseData: Merchandise[] = await response.json();
      const formattedMerchandise = merchandiseData.map(m => ({ id: m.id, name: m.name }));
      setMerchandiseItems(formattedMerchandise);
    } catch (error: any) {
      toast.error(error.message || t('toast.fetchMerchandiseError'));
      setMerchandiseItems([]);
    } finally {
      setIsLoadingMerchandise(false);
    }
  }, [t]);

  useEffect(() => {
    loadStyleProfiles();
    loadMerchandiseItems();
  }, [loadStyleProfiles, loadMerchandiseItems]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isEditMode && onGenerationStart) {
      onGenerationStart();
    }

    setIsSubmitting(true);

    if (isEditMode && editingOutline) {
      if (!title.trim() && !editableContent.trim() && !userKeyPoints.trim()) { 
        toast.error(t('validation.updateMinimum'));
        setIsSubmitting(false);
        return;
      }
      const updatePayload: { title?: string; content?: string; userKeyPoints?: string; styleProfileId?: string; merchandiseId?: string | null } = {};
      if (title !== (editingOutline.title || '')) updatePayload.title = title; 
      if (editableContent !== (editingOutline.content || '')) updatePayload.content = editableContent;
      if (userKeyPoints !== (editingOutline.userKeyPoints || '')) updatePayload.userKeyPoints = userKeyPoints;
      if (selectedStyleProfileId !== (editingOutline.styleProfileId || '')) updatePayload.styleProfileId = selectedStyleProfileId;
      if (selectedMerchandiseId !== (editingOutline.merchandiseId || '')) {
        updatePayload.merchandiseId = selectedMerchandiseId === '' ? null : selectedMerchandiseId;
      }

      if (Object.keys(updatePayload).length === 0) {
        toast.info(t('toast.noChanges'));
        setIsSubmitting(false);
        onSuccess(); 
        return;
      }

      try {
        const response = await fetch(`/api/outlines/${editingOutline.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload), 
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to update outline' }));
          throw new Error(errorData.message || t('toast.updateError'));
        }
        const result = await response.json();
        toast.success(result.message || t('toast.updateSuccess'));
        onSuccess(result.outline as GeneratedOutline);
      } catch (error: any) {
        toast.error(error.message || t('toast.updateError'));
      } finally {
        setIsSubmitting(false);
      }
      return; 
    }

    if (!title.trim()) {
      toast.error(t('validation.titleRequired'));
      setIsSubmitting(false);
      return;
    }
    if (!selectedStyleProfileId) {
      toast.error(t('validation.styleProfileRequired'));
      setIsSubmitting(false);
      if (!isEditMode && onGenerationStart) onSuccess();
      return;
    }
    if (!userKeyPoints.trim()) {
      toast.error(t('validation.keyPointsRequired'));
      setIsSubmitting(false);
      if (!isEditMode && onGenerationStart) onSuccess();
      return;
    }

    if (!session || !session.user || !session.user.teams || session.user.teams.length === 0) {
      toast.error(t('validation.teamRequired'));
      setIsSubmitting(false);
      return;
    }
    const teamId = session.user.teams[0].id;
    if (!teamId) {
        toast.error(t('validation.teamRequired'));
        setIsSubmitting(false);
        if (!isEditMode && onGenerationStart) onSuccess();
        return;
    }

    try {
      const response = await fetch('/api/outlines/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || undefined,
          userKeyPoints,
          styleProfileId: selectedStyleProfileId,
          teamId: teamId,
          merchandiseId: selectedMerchandiseId === '' ? undefined : selectedMerchandiseId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate outline' }));
        throw new Error(errorData.message || t('toast.generateError'));
      }
      const result = await response.json();
      toast.success(result.message || t('toast.generateSuccess'));
      onSuccess(result.outline as GeneratedOutline);
    } catch (error: any) {
      toast.error(error.message || t('toast.generateError'));
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  // 自适应高度调整函数
  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement, minHeight: number = 100) => {
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(minHeight, Math.min(400, scrollHeight));
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  // 监听userKeyPoints变化，自动调整高度
  useEffect(() => {
    if (keyPointsTextareaRef.current) {
      adjustTextareaHeight(keyPointsTextareaRef.current, 100);
    }
    if (keyPointsNewTextareaRef.current) {
      adjustTextareaHeight(keyPointsNewTextareaRef.current, 150);
    }
  }, [userKeyPoints, adjustTextareaHeight]);



  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full" id="outlineForm">
      {isEditMode ? (
        <div className="flex-1 flex space-x-6 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex-shrink-0 mb-4">
              <Label htmlFor="outline-content" className="mb-1.5 flex items-center">
                <ContentIcon size={14} className="mr-1.5 text-indigo-600" /> {t('form.content.label')}
              </Label>
            </div>
            <div className="flex-1" style={{ height: 'calc(100vh - 230px)', maxHeight: 'calc(90vh - 230px)' }}>
              <MarkdownEditor
                value={editableContent}
                onChange={setEditableContent}
                placeholder={t('form.content.placeholder')}
                height="100%"
                disabled={isSubmitting || isParentGenerating || isInternalViewMode}
                className="h-full"
                showToolbar={!isInternalViewMode}
                hidePreviewToggle={true}
                initialPreviewMode={isInternalViewMode}
                key={`markdown-${isInternalViewMode ? 'preview' : 'edit'}`}
              />
            </div>
          </div>

                      <div className="w-1/4 flex-shrink-0 flex flex-col space-y-4 min-w-[300px] overflow-y-auto">
            <div>
              <Label htmlFor="outline-title" className="mb-1.5 flex items-center">
                <TitleIcon size={14} className="mr-1.5 text-blue-600" /> {t('form.title.label')}
              </Label>
              <Input 
                id="outline-title" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder={t('form.title.placeholder')}
                disabled={isSubmitting || isParentGenerating || isInternalViewMode}
              />
            </div>
            
            <div>
              <Label htmlFor="style-profile" className="mb-1.5 flex items-center">
                <StyleProfileIcon size={14} className="mr-1.5 text-pink-600" /> {t('form.styleProfile.label')}
              </Label>
              {isLoadingProfiles ? (
                <p>{t('form.styleProfile.loading')}</p>
              ) : styleProfiles.length === 0 ? (
                <p className="text-sm text-red-600">{t('toast.fetchStyleProfilesError')}</p>
              ) : (
                <Select 
                  value={selectedStyleProfileId}
                  onValueChange={setSelectedStyleProfileId}
                  disabled={isSubmitting || isParentGenerating || isInternalViewMode}
                >
                  <SelectTrigger id="style-profile">
                    <SelectValue placeholder={!selectedStyleProfileId ? t('form.styleProfile.placeholder') : t('form.styleProfile.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {editingOutline && editingOutline.styleProfileId && !styleProfiles.find(p => p.id === editingOutline.styleProfileId) && (
                      <SelectItem value={editingOutline.styleProfileId} disabled>
                        {editingOutline?.styleProfile?.name || `Profile ID: ${editingOutline.styleProfileId} (Not found/deleted)`}
                      </SelectItem>
                    )}
                    {styleProfiles.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="merchandise-item" className="mb-1.5 flex items-center">
                <MerchandiseIcon size={14} className="mr-1.5 text-green-600" /> {t('form.merchandise.label')}
              </Label>
              {isLoadingMerchandise ? (
                <p>{t('form.styleProfile.loading')}</p>
              ) : merchandiseItems.length === 0 ? (
                <p className="text-sm text-gray-500">{t('toast.fetchMerchandiseError')}</p>
              ) : (
                <Select 
                  value={selectedMerchandiseId}
                  onValueChange={(value) => setSelectedMerchandiseId(value === 'none' ? '' : value)}
                  disabled={isSubmitting || isParentGenerating || isInternalViewMode}
                >
                  <SelectTrigger id="merchandise-item">
                    <SelectValue placeholder={t('form.merchandise.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('form.merchandise.none')}</SelectItem>
                    {editingOutline && editingOutline.merchandiseId && !merchandiseItems.find(m => m.id === editingOutline.merchandiseId) && (
                        <SelectItem value={editingOutline.merchandiseId} disabled>
                            {editingOutline?.merchandise?.name || `Merchandise ID: ${editingOutline.merchandiseId} (Not in list)`}
                        </SelectItem>
                    )}
                    {merchandiseItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="key-points" className="mb-1.5 flex items-center">
                <KeyPointsIcon size={14} className="mr-1.5 text-purple-600" /> {t('form.keyPoints.label')}
              </Label>
              <Textarea 
                id="key-points" 
                value={userKeyPoints} 
                onChange={(e) => setUserKeyPoints(e.target.value)} 
                placeholder={t('form.keyPoints.placeholder')}
                disabled={isSubmitting || isParentGenerating || isInternalViewMode}
                className="min-h-[100px] max-h-[400px] resize-none overflow-y-auto"
                ref={keyPointsTextareaRef}
              />
              <p className="mt-1 text-xs text-gray-500">{t('form.keyPoints.hint')}</p>
            </div>

            {editingOutline && editingOutline.outlineAudiences && editingOutline.outlineAudiences.length > 0 && (
              <div className="pt-3 mt-3 border-t">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Users size={14} className="mr-1.5 text-indigo-600" />
                    {t('modal.view.suggestedAudiences')} ({editingOutline.outlineAudiences.length})
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAudienceDialogOpen(true)}
                    className="h-6 px-2 text-xs flex items-center"
                  >
                    <Eye size={12} className="mr-1" />
                    查看详情
                  </Button>
                </div>
                <div className="space-y-2">
                  {editingOutline.outlineAudiences.slice(0, 3).map((oaLink, index) => (
                    <div key={oaLink.audience.id} className="border rounded-md bg-slate-50 dark:bg-slate-700/50 p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-wrap gap-1 flex-1 min-w-0">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs truncate">
                            {index + 1}. {oaLink.audience.name}
                          </span>
                          {oaLink.audience.type && (
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              {oaLink.audience.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {editingOutline.outlineAudiences.length > 3 && (
                    <div className="text-xs text-gray-500 italic">
                      还有 {editingOutline.outlineAudiences.length - 3} 个受众...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 overflow-y-auto">
          <div>
            <Label htmlFor="outline-title-new" className="mb-1.5 flex items-center">
              <TitleIcon size={14} className="mr-1.5 text-blue-600" /> {t('form.title.label')} <span className="text-red-500">{t('form.required')}</span>
            </Label>
            <Input 
              id="outline-title-new" 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder={t('form.title.placeholder')}
              disabled={isSubmitting || isParentGenerating}
            />
          </div>
          <div>
            <Label htmlFor="style-profile-new" className="mb-1.5 flex items-center">
              <StyleProfileIcon size={14} className="mr-1.5 text-pink-600" /> {t('form.styleProfile.label')} <span className="text-red-500">{t('form.required')}</span>
            </Label>
            {isLoadingProfiles ? (
              <p>{t('form.styleProfile.loading')}</p>
            ) : styleProfiles.length === 0 ? (
              <p className="text-sm text-red-600">{t('toast.fetchStyleProfilesError')}</p>
            ) : (
              <Select 
                value={selectedStyleProfileId}
                onValueChange={setSelectedStyleProfileId}
                disabled={isSubmitting || isParentGenerating}
              >
                <SelectTrigger id="style-profile">
                  <SelectValue placeholder={t('form.styleProfile.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {styleProfiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="merchandise-item-new" className="mb-1.5 flex items-center">
              <MerchandiseIcon size={14} className="mr-1.5 text-green-600" /> {t('form.merchandise.label')}
            </Label>
            {isLoadingMerchandise ? (
              <p>{t('form.styleProfile.loading')}</p>
            ) : merchandiseItems.length === 0 ? (
                <p className="text-sm text-gray-500">{t('toast.fetchMerchandiseError')}</p>
            ) : (
              <Select 
                value={selectedMerchandiseId}
                onValueChange={(value) => setSelectedMerchandiseId(value === 'none' ? '' : value)}
                disabled={isSubmitting || isParentGenerating}
              >
                <SelectTrigger id="merchandise-item-new">
                  <SelectValue placeholder={t('form.merchandise.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('form.merchandise.none')}</SelectItem>
                  {merchandiseItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="key-points-new" className="mb-1.5 flex items-center">
              <KeyPointsIcon size={14} className="mr-1.5 text-purple-600" /> {t('form.keyPoints.label')} <span className="text-red-500">{t('form.required')}</span>
            </Label>
            <Textarea 
              id="key-points-new" 
              value={userKeyPoints} 
              onChange={(e) => setUserKeyPoints(e.target.value)} 
              placeholder={t('form.keyPoints.placeholder')}
              disabled={isSubmitting || isParentGenerating}
              className="min-h-[150px] max-h-[400px] resize-none overflow-y-auto"
              ref={keyPointsNewTextareaRef}
            />
          </div>
        </div>
      )}

      {/* 移除所有内部按钮，现在统一在Dialog外部处理 */}
      
      {/* 推荐受众详情弹窗 */}
      {editingOutline && editingOutline.outlineAudiences && (
        <AudienceDetailsDialog
          open={isAudienceDialogOpen}
          onOpenChange={setIsAudienceDialogOpen}
          audiences={editingOutline.outlineAudiences}
          outlineTitle={editingOutline.title}
        />
      )}
    </form>
  );
} 