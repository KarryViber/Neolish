'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Outline as PrismaOutline, StyleProfile, Audience as PrismaAudience, Merchandise } from '@prisma/client';
import { Toaster, toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import OutlineForm from '@/components/outlines/OutlineForm'; 
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css/github-markdown.css';
import { Badge } from '@/components/ui/badge';
import { Palette, CalendarDays, Users, FileEdit, Trash2, PlusCircle as PlusCircleIcon, Search, LogOut, UserCircle2, Loader2, AlertTriangle, Edit2, FileText, Ban, Save, Wand2 } from 'lucide-react';

import type { GeneratedOutline, OutlineDataForForm } from '@/components/outlines/OutlineForm';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

interface AudienceInOutline extends PrismaAudience {
  tags: string[];
}

interface OutlineAudienceLink {
  audience: AudienceInOutline;
}

interface OutlineWithDetails extends Omit<PrismaOutline, 'content' | 'userKeyPoints'> { 
  content: string | null; 
  userKeyPoints: string | null;
  styleProfile?: Pick<StyleProfile, 'id' | 'name'> | null;
  outlineAudiences?: OutlineAudienceLink[];
  user?: { username: string };
  merchandise?: Pick<Merchandise, 'id' | 'name'> | null;
}

interface StyleProfileFilterItem extends Pick<StyleProfile, 'id' | 'name'> {}

export default function OutlinesPage() {
  const [outlines, setOutlines] = useState<OutlineWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'preview' | null>(null);
  const [editingOutline, setEditingOutline] = useState<OutlineWithDetails | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);

  const [searchTermTitle, setSearchTermTitle] = useState('');
  const [selectedStyleProfileId, setSelectedStyleProfileId] = useState('');
  const [searchTermAudienceTags, setSearchTermAudienceTags] = useState('');
  const [styleProfilesForFilter, setStyleProfilesForFilter] = useState<StyleProfileFilterItem[]>([]);
  const [isLoadingStyleProfiles, setIsLoadingStyleProfiles] = useState<boolean>(false);

  const t = useTranslations('outlines');

  useEffect(() => {
    const fetchStyleProfilesForFilter = async () => {
      setIsLoadingStyleProfiles(true);
      try {
        const response = await fetch('/api/style-profiles'); 
        if (!response.ok) {
          throw new Error('Failed to fetch style profiles for filter');
        }
        const data: StyleProfileFilterItem[] = await response.json();
        setStyleProfilesForFilter(data);
      } catch (error: any) {
        console.error('Error fetching style profiles for filter:', error);
        toast.error(t('toast.loadStyleProfilesError'));
        setStyleProfilesForFilter([]);
      } finally {
        setIsLoadingStyleProfiles(false);
      }
    };
    fetchStyleProfilesForFilter();
  }, []);

  const loadOutlines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchTermTitle) queryParams.append('title', searchTermTitle);
      if (selectedStyleProfileId) queryParams.append('styleProfileId', selectedStyleProfileId);
      if (searchTermAudienceTags) queryParams.append('audienceTag', searchTermAudienceTags);
      
      const response = await fetch(`/api/outlines?${queryParams.toString()}`); 
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch outlines' }));
        throw new Error(errorData.message || t('toast.fetchOutlinesError'));
      }
      const data: OutlineWithDetails[] = await response.json(); 
      setOutlines(data);
    } catch (error: any) {
      const errorMessage = error.message || t('toast.fetchOutlinesError');
      toast.error(errorMessage);
      setError(errorMessage);
      setOutlines([]); 
    } finally {
      setIsLoading(false);
    }
  }, [searchTermTitle, selectedStyleProfileId, searchTermAudienceTags, t]);

  useEffect(() => {
    const handler = setTimeout(() => {
    loadOutlines();
    }, 500);
    return () => clearTimeout(handler);
  }, [loadOutlines]);

  const handleAddNewOutline = () => {
    setEditingOutline(null); 
    setIsGeneratingOutline(false);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditOutline = (outline: OutlineWithDetails) => {
    setEditingOutline(outline);
    setIsGeneratingOutline(false);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handlePreviewOutline = (outline: OutlineWithDetails) => {
    setEditingOutline(outline);
    setModalMode('preview');
    setIsModalOpen(true);
  };

  const handleDeleteOutline = async (outlineId: string, outlineTitle: string) => {
    if (window.confirm(t('deleteConfirm.message', { title: outlineTitle || t('card.untitledOutline') }))) {
      try {
        const response = await fetch(`/api/outlines/${outlineId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to delete outline' }));
          throw new Error(errorData.message || t('toast.deleteError'));
        }
        toast.success(t('toast.deleteSuccess', { title: outlineTitle || t('card.untitledOutline') }));
        setOutlines(prevOutlines => prevOutlines.filter(o => o.id !== outlineId));
      } catch (error: any) {
        toast.error(error.message || t('toast.deleteError'));
      }
    }
  };

  const handleFormSuccess = (generatedOrUpdatedOutline?: GeneratedOutline | OutlineWithDetails) => {
    setIsGeneratingOutline(false);
    loadOutlines();

    if (generatedOrUpdatedOutline && !editingOutline) {
      const newOutlineForEditing = generatedOrUpdatedOutline as OutlineWithDetails;
      setEditingOutline(newOutlineForEditing);
    } else if (generatedOrUpdatedOutline && editingOutline) {
      setEditingOutline(null);
      setIsModalOpen(false);
    } else if (!generatedOrUpdatedOutline && !editingOutline) {
      // No further action needed here, user can retry or cancel
    } else {
      setEditingOutline(null);
      setIsModalOpen(false);
    }
  };

  const handleGenerationStart = () => {
    if (!editingOutline) {
      setIsGeneratingOutline(true);
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingOutline(null);
    setIsModalOpen(false);
    setIsGeneratingOutline(false);
  };

  const handleFilterSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    loadOutlines();
  };

  if (isLoading && !error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]"> 
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center p-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">{t('error.title')}</h2>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-wrap">{error}</p>
        <Button onClick={() => loadOutlines()} disabled={isLoading}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> {t('error.tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster richColors position="top-right" />
      <div className="mb-6 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <FileText size={28} className="mr-3 text-purple-600" />
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('subtitle')}</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            closeModal();
          } else {
            setIsModalOpen(true);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNewOutline} className="flex items-center">
                <PlusCircleIcon size={16} className="mr-2" /> {t('buttons.newOutline')}
            </Button>
          </DialogTrigger>
          <DialogContent className={`${editingOutline && !isGeneratingOutline ? 'sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px] w-[90vw] max-h-[90vh] flex flex-col' : (isGeneratingOutline ? 'sm:max-w-[550px] max-h-[450px] flex flex-col' : 'sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px] w-[90vw] max-h-[90vh] flex flex-col')} data-[state=open]:slide-in-from-bottom-1 p-0`}>
            <DialogHeader className="p-6 pb-4">
              <DialogTitle>
                {isGeneratingOutline ? t('modal.generating.title') : 
                 modalMode === 'preview' ? t('modal.view.title', { title: editingOutline?.title || t('card.untitledOutline') }) :
                 modalMode === 'edit' ? t('modal.edit.title') : t('modal.new.title')}
              </DialogTitle>
              <DialogDescription>
                {isGeneratingOutline ? t('modal.generating.message') : 
                 modalMode === 'preview' ? t('modal.view.description') :
                 modalMode === 'edit' ? t('modal.edit.description') : t('modal.new.description')}
              </DialogDescription>
            </DialogHeader>
            
            {isGeneratingOutline && !editingOutline ? (
              <div className="flex flex-col items-center justify-center space-y-4 flex-grow py-10">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-hidden p-6 pt-0">
                  <OutlineForm 
                    editingOutline={editingOutline as OutlineDataForForm | null}
                    onSuccess={handleFormSuccess} 
                    onCancel={closeModal}
                    onGenerationStart={handleGenerationStart}
                    isParentGenerating={isGeneratingOutline && !editingOutline}
                    isViewMode={modalMode === 'preview'}
                  />
                </div>
                
                {/* 固定在Dialog底部的按钮区域 */}
                <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 rounded-b-lg">
                  <div className="flex justify-end items-center space-x-3">
                    {modalMode === 'preview' ? (
                      <>
                        <Button 
                          type="button" 
                          variant="default" 
                          onClick={() => setModalMode('edit')} 
                          className="flex items-center"
                        >
                          <Edit2 size={16} className="mr-2" /> {t('buttons.editOutline')}
                        </Button>
                        <Button type="button" variant="outline" onClick={closeModal} className="flex items-center">
                          <Ban size={16} className="mr-2" /> {t('buttons.close')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="button" variant="outline" onClick={closeModal} disabled={isGeneratingOutline} className="flex items-center">
                          <Ban size={16} className="mr-2" /> {t('buttons.cancel')}
                        </Button>
                        <Button 
                          type="submit" 
                          form="outlineForm" 
                          disabled={isGeneratingOutline} 
                          className="flex items-center"
                        >
                          {isGeneratingOutline ? <Loader2 size={16} className="mr-2 animate-spin" /> : (editingOutline ? <Save size={16} className="mr-2" /> : <Wand2 size={16} className="mr-2" />)}
                          {isGeneratingOutline 
                            ? (editingOutline ? t('buttons.updating') : t('buttons.generating'))
                            : (editingOutline ? t('buttons.update') : t('buttons.generate'))}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleFilterSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="searchTermTitle" className="block text-sm font-medium text-gray-700 mb-1">{t('search.titleLabel')}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="searchTermTitle"
              type="search"
              placeholder={t('search.titlePlaceholder')}
              value={searchTermTitle}
              onChange={(e) => setSearchTermTitle(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div>
          <label htmlFor="styleProfileFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('search.styleProfileLabel')}</label>
          <Select 
            value={selectedStyleProfileId} 
            onValueChange={(value) => setSelectedStyleProfileId(value === 'all' ? '' : value)}
            disabled={isLoadingStyleProfiles}
          >
            <SelectTrigger id="styleProfileFilter" className="w-full">
              <SelectValue placeholder={isLoadingStyleProfiles ? t('search.styleProfileLoading') : t('search.styleProfileAll')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('search.styleProfileAll')}</SelectItem>
              {styleProfilesForFilter.map(profile => (
                <SelectItem key={profile.id} value={profile.id}>{profile.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="searchTermAudienceTags" className="block text-sm font-medium text-gray-700 mb-1">{t('search.audienceTagsLabel')}</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="searchTermAudienceTags"
              type="search"
              placeholder={t('search.audienceTagsPlaceholder')}
              value={searchTermAudienceTags}
              onChange={(e) => setSearchTermAudienceTags(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </form>

      {outlines.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {t('emptyState.noOutlines')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {outlines.map((outline) => {
            const uniqueAudienceNames = outline.outlineAudiences
              ?.map(oaLink => oaLink.audience.name)
              .filter((name, index, self) => name && self.indexOf(name) === index)
              .slice(0, 3);

            return (
              <div 
                key={outline.id} 
                className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full border border-gray-200 dark:border-slate-700 border-t-4 border-purple-500/50 cursor-pointer"
                onClick={() => handlePreviewOutline(outline)}
              >
                <div className="flex-grow mb-4 relative pt-8">
                  <FileText size={24} className="absolute top-0 left-0 text-purple-500 opacity-75" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2 truncate" title={outline.title || t('card.untitledOutline')}>
                    {outline.title || t('card.untitledOutline')}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-3 max-h-20 overflow-hidden overflow-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {outline.userKeyPoints 
                      ? outline.userKeyPoints 
                      : <span className="italic">{t('card.noKeyPoints')}</span>}
                  </p>

                  {uniqueAudienceNames && uniqueAudienceNames.length > 0 && (
                    <div className="mb-3">
                      {uniqueAudienceNames.map((name, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs font-normal">{name}</Badge>
                      ))}
                      {(outline.outlineAudiences?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs font-normal">{t('card.moreItems', { count: (outline.outlineAudiences?.length || 0) - 3 })}</Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 text-xs text-gray-500 dark:text-slate-400 space-y-1.5">
                  {outline.styleProfile?.name && (
                    <p className="flex items-center">
                      <Palette size={14} className="mr-1.5 text-purple-600 dark:text-purple-400" />
                      {t('card.style')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{outline.styleProfile.name}</span>
                    </p>
                  )}

                  {outline.user?.username && (
                    <p className="flex items-center">
                      <UserCircle2 size={14} className="mr-1.5 text-sky-600 dark:text-sky-400" /> 
                      {t('card.createdBy')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{outline.user.username}</span>
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <p className="flex items-center">
                      <CalendarDays size={14} className="mr-1.5 text-green-600 dark:text-green-400" /> 
                      {t('card.created')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{new Date(outline.updatedAt).toLocaleDateString('en-CA')}</span>
                    </p>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}> {/* Prevent card click when clicking action buttons */}
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditOutline(outline); }} title={t('card.editTitle')}>
                        <Edit2 className="h-4 w-4 text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDeleteOutline(outline.id, outline.title || t('card.untitledOutline')); }} title={t('card.deleteTitle')}>
                        <Trash2 className="h-4 w-4 text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}