'use client'; // Need client component for state and interactions

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import AddStyleProfileForm from '@/components/style-profiles/AddStyleProfileForm'; // Replaced by StyleProfileForm
import type { StyleProfile } from '@prisma/client';
import { Toaster, toast } from "sonner"; // Toaster component is from here
import StyleProfileForm from '@/components/style-profiles/StyleProfileForm';
import { CalendarDays, Link as LinkIcon, PlusCircle, Ban, SearchCheck, FileEdit, Trash2, Loader2, Search, Edit3, Edit2, FileText, UserCircle2, AlertTriangle, Palette, Save } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-dialog'; // Import icons UserCircle2, Added Edit2, Added Palette, Added Save
import { useSession } from "next-auth/react"; // Import useSession hook
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// Define a new interface that includes the user information
interface StyleProfileWithUser extends StyleProfile {
  user?: {
    username: string;
  };
}

// Fetch data on the client side now
async function getStyleProfilesClient(searchTerm: string, t: any): Promise<StyleProfileWithUser[]> {
  console.log(`getStyleProfilesClient called with searchTerm: ${searchTerm}`);
  try {
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append('searchTerm', searchTerm);
    }
    const response = await fetch(`/api/style-profiles?${queryParams.toString()}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: t('toast.loadError') }));
      throw new Error(errorData.message);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching style profiles client-side:", error);
    toast.error(error.message || t('toast.loadError')); // Notify user
    return [];
  }
}

// Define the expected structure from the form (might differ slightly from DB model)
interface StyleProfileSubmitData {
  id?: string; 
  name: string;
  description?: string | null;
  // These now expect plain strings from the form
  authorInfo?: string | null; 
  styleFeatures?: string | null; 
  sampleText?: string | null;
  // Add teamId here, although it will be added just before sending
  teamId?: string; 
}

export default function StyleProfilesPage() {
  const { data: session } = useSession(); // Get session data
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('style-profiles');
  
  const [profiles, setProfiles] = useState<StyleProfileWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Renamed from isLoadingList
  const [error, setError] = useState<string | null>(null); // New error state
  const [isProcessing, setIsProcessing] = useState(false); // For form submissions, URL analysis
  
  type AddProfileStage = 'selectMethod' | 'manualForm' | 'urlInput' | 'analyzingUrl';
  const [addProfileStage, setAddProfileStage] = useState<AddProfileStage>('selectMethod');

  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'preview' | null>(null);
  const [editingProfile, setEditingProfile] = useState<StyleProfileWithUser | null>(null);
  const [analyzedProfileData, setAnalyzedProfileData] = useState<StyleProfileSubmitData | null>(null); // New state for analyzed data

  const [analysisUrl, setAnalysisUrl] = useState('');
  const [analysisProfileName, setAnalysisProfileName] = useState('');
  
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Reset error on new load
    try {
      // Fetch data on the client side
      console.log(`Loading profiles with searchTerm: ${searchTerm}`);
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('searchTerm', searchTerm);
      }
      const response = await fetch(`/api/style-profiles?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: t('toast.loadError') }));
        throw new Error(errorData.message);
      }
      const fetchedProfiles = await response.json();
      setProfiles(fetchedProfiles);
    } catch (err: any) {
      // This catch is more for unexpected errors from the fetch itself
      const errorMessage = err.message || t('toast.loadError');
      toast.error(errorMessage); 
      setError(errorMessage);
      setProfiles([]);
    }
    finally {
      setIsLoading(false);
    }
  }, [searchTerm, t]);

  useEffect(() => {
    const handler = setTimeout(() => {
    loadProfiles();
    }, 500);

    return () => {
        clearTimeout(handler);
    };
  }, [loadProfiles, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingProfile(null);
    setModalMode('add');
    setAddProfileStage('selectMethod'); // Start with method selection
    setAnalyzedProfileData(null); // Clear any previous analyzed data
    // Reset URL analysis specific states
    setAnalysisUrl('');
    setAnalysisProfileName('');
  };

  const handleEditClick = (profile: StyleProfileWithUser) => {
    setEditingProfile(profile);
    setModalMode('edit');
    setAnalyzedProfileData(null); // Ensure no conflict with analyzed data flow
  };
  
  const closeModal = () => {
    setModalMode(null);
    setEditingProfile(null);
    setAnalyzedProfileData(null); // Clear analyzed data on close
    // Reset URL analysis specific states as well, if not already handled by stage reset
    setAnalysisUrl('');
    setAnalysisProfileName('');
    setAddProfileStage('selectMethod'); // Reset stage for next time
  };

  const handleFormSubmit = async (formDataFromForm: StyleProfileSubmitData) => {
    setIsProcessing(true);
    const isEdit = !!editingProfile; // True if we are editing an existing profile - moved outside try block
    try {
      
      // Prepare data for the API
      const apiData: any = {
        name: formDataFromForm.name,
        description: formDataFromForm.description,
        // Transform plain string inputs for authorInfo and styleFeatures to match Prisma structure if needed
        // Assuming the backend expects { manual_input: string } or similar for these JSON fields
        authorInfo: formDataFromForm.authorInfo ? { manual_input: formDataFromForm.authorInfo } : null,
        styleFeatures: formDataFromForm.styleFeatures ? { manual_input: formDataFromForm.styleFeatures } : null,
        sampleText: formDataFromForm.sampleText,
      };

      if (isEdit && editingProfile) {
        // This is a true edit of an existing profile
        apiData.id = editingProfile.id;
        // teamId is part of the existing profile and is not changed during an edit via this form.
        // The backend PUT /api/style-profiles/[id] should preserve or handle teamId updates if any.
      } else if (analyzedProfileData && analyzedProfileData.teamId) {
        // This is a new profile being created from previously analyzed URL data
        apiData.teamId = analyzedProfileData.teamId; // Use teamId from the analysis context
        // Ensure no 'id' is sent if 'analyzedProfileData' somehow had one and we intend to create new
        // delete apiData.id; // Or handled by StyleProfileForm not setting it when isEditMode is false
      } else {
        // This is a brand new profile being created manually (not from URL analysis, not an edit)
        if (!session || !session.user || !session.user.teams || session.user.teams.length === 0) {
          toast.error(t('toast.sessionMissing'));
          setIsProcessing(false);
          return;
        }
        apiData.teamId = session.user.teams[0].id; // Assign teamId from the current user's session
      }

      const response = await fetch(isEdit ? `/api/style-profiles/${apiData.id}` : '/api/style-profiles', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        let errorMessage = isEdit ? t('toast.updateError') : t('toast.createError');
        try {
          const errorData = await response.json();
          // Use the specific message from backend if available (e.g., for 409 conflict or other validation errors)
          errorMessage = errorData.message || errorData.error || errorMessage;
          // If Zod validation error, it might be under errorData.errors (as seen in POST /api/style-profiles)
          if (errorData.errors) {
            // Construct a more detailed message from Zod errors if possible
            // For simplicity, we'll just use the main message for now, but this could be enhanced.
            // Example: const fieldErrors = Object.values(errorData.errors).flat().join(', ');
            // errorMessage += `: ${fieldErrors}`;
          }
        } catch (jsonError) {
          // If error response is not JSON, use status text or the generic message
          errorMessage = response.statusText || errorMessage;
          console.warn("Error response was not valid JSON:", await response.text());
        }
        throw new Error(errorMessage);
      }

      toast.success(t(isEdit ? 'toast.updateSuccess' : 'toast.createSuccess'));
      closeModal();
      loadProfiles();
      setAnalyzedProfileData(null); // Clear analyzed data after successful submission
    } catch (err: any) {
      toast.error(err.message || t(isEdit ? 'toast.updateError' : 'toast.createError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = async (profileId: string, profileName: string) => {
    if (window.confirm(t('modal.delete.confirm', { name: profileName }))) {
      setDeletingProfileId(profileId);
      setIsProcessing(true); // Also indicate processing for delete
      try {
        const response = await fetch(`/api/style-profiles/${profileId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: t('toast.deleteError') }));
          throw new Error(errorData.message);
        }
        toast.success(t('toast.deleteSuccess', { name: profileName }));
        loadProfiles();
      } catch (err: any) {
        toast.error(err.message || t('toast.deleteError'));
      } finally {
        setDeletingProfileId(null);
        setIsProcessing(false);
      }
    }
  };

  const handleAnalyzeUrlSubmit = async () => {
    if (!analysisUrl.trim()) {
      toast.error(t('toast.urlRequired'));
      return;
    }
    setIsProcessing(true);
    try {
      // --- Get teamId from session for analyze-url ---
      if (!session || !session.user) {
        toast.error(t('toast.sessionMissing'));
        setIsProcessing(false);
        setAddProfileStage('urlInput'); // Stay on URL input stage on error
        return;
      }
      const teamId = session.user.teams?.[0]?.id;
      if (!teamId) {
        toast.error(t('toast.sessionMissing'));
        setIsProcessing(false);
        setAddProfileStage('urlInput'); // Stay on URL input stage on error
        return;
      }
      // --- End get teamId ---

      const requestBody = {
        urls: analysisUrl.split(/\r?\n/).filter(url => url.trim() !== ''), // Split by newline and filter empty
        analysisProfileName: analysisProfileName.trim() || null,
        teamId: teamId, // Pass teamId to the backend
      };

      // Validate that at least one URL is provided after splitting and filtering
      if (requestBody.urls.length === 0) {
        toast.error(t('toast.urlRequired'));
        setIsProcessing(false);
        setAddProfileStage('urlInput');
        return;
      }

      setAddProfileStage('analyzingUrl'); // Show loading/analyzing state

      const response = await fetch('/api/style-profiles/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: t('toast.analysisError') }));
        throw new Error(errorData.message || t('toast.analysisError'));
      }

      // New: Handle successful analysis response
      const result = await response.json();
      if (result.analyzedProfileData) {
        setAnalyzedProfileData(result.analyzedProfileData as StyleProfileSubmitData);
        setModalMode('add'); // Keep in 'add' mode or a specific 'review' mode if created
        setAddProfileStage('manualForm'); // Transition to the form, now pre-filled
        toast.info(t('toast.analysisSuccess'));
      } else {
        // Should not happen if API is correct, but handle defensively
        throw new Error(t('toast.analysisError'));
      }

    } catch (err: any) {
      toast.error(err.message || t('toast.analysisError'));
      setAddProfileStage('urlInput'); // Revert to URL input on error
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    loadProfiles();
  };

  const handleCardClick = (profile: StyleProfileWithUser) => {
    setEditingProfile(profile);
    setModalMode('preview');
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
        <Button onClick={() => loadProfiles()} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t('error.tryAgain')}
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
            <Palette size={28} className="mr-3 text-blue-600" /> 
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('subtitle')}</p>
        </div>
        <div className="flex space-x-2">
          {/* Unified "New Style Profile" Button */}
          <Button onClick={handleOpenAddModal} className="flex items-center" disabled={isProcessing}>
            <PlusCircle size={16} className="mr-2" /> {t('buttons.newProfile')}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </form>
      </div>

      {!isLoading && profiles.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">{t('emptyState.title')}</p>
          <p className="text-sm text-gray-400 mt-2">{t('emptyState.subtitle')}</p>
        </div>
      )}

      {!isLoading && profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full border border-gray-200 dark:border-slate-700 border-t-4 border-blue-500 cursor-pointer"
              onClick={() => handleCardClick(profile)}
            >
              <div className="flex-grow mb-4 relative pt-8">
                <Palette size={24} className="absolute top-0 left-0 text-blue-500 opacity-75" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2 truncate" title={profile.name}>
                  {profile.name}
                </h3>
                <p 
                  className="text-sm text-gray-600 dark:text-slate-300 mb-4" 
                  title={profile.description || ''}
                  style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '60px', // Approx 3 lines * 20px/line height
                    maxHeight: '60px' // Ensure it doesn't exceed 3 lines
                  }}
                >
                  {profile.description || t('card.noDescription')}
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 text-xs text-gray-500 dark:text-slate-400 space-y-1.5">
                {profile.user?.username && (
                  <p className="flex items-center">
                    <UserCircle2 size={14} className="mr-1.5 text-sky-600 dark:text-sky-400" /> 
                    {t('card.createdBy')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{profile.user.username}</span>
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <p className="flex items-center">
                    <CalendarDays size={14} className="mr-1.5 text-green-600 dark:text-green-400" /> 
                    {t('card.updated')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{new Date(profile.updatedAt).toLocaleDateString('en-CA')}</span>
                  </p>
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}> {/* Prevent card click when clicking action buttons */}
                    <Button 
                      variant="ghost"
                      size="icon" 
                      onClick={() => handleEditClick(profile)} 
                      disabled={isProcessing || deletingProfileId === profile.id}
                      title={t('buttons.editProfile')}
                      className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(profile.id, profile.name)} 
                      disabled={deletingProfileId === profile.id || isProcessing} 
                      title={t('buttons.deleteProfile')}
                      className="text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      {deletingProfileId === profile.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Dialog for Add/Edit/Analyze/Preview */}
      <Dialog 
        open={modalMode === 'add' || modalMode === 'edit' || modalMode === 'preview'} 
        onOpenChange={(open) => { if (!open) closeModal(); }}
      >
        <DialogContent 
            className={
                modalMode === 'edit' || modalMode === 'preview' || (modalMode === 'add' && addProfileStage === 'manualForm')
                ? "sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px] w-[90vw] max-h-[90vh] flex flex-col p-0" // Adjusted for manual form, edit and preview
                : modalMode === 'add' && addProfileStage === 'urlInput'
                  ? "sm:max-w-[600px] md:max-w-[750px] max-h-[90vh]" // Wider for URL input
                  : modalMode === 'add' && addProfileStage === 'analyzingUrl'
                    ? "sm:max-w-[550px] max-h-[450px]" // 统一analyzing弹窗尺寸
                    : "sm:max-w-[550px] max-h-[90vh]" // Default for selection
            }
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>
              {modalMode === 'edit' && editingProfile ? t('modal.edit.title', { name: editingProfile.name }) :
               modalMode === 'preview' && editingProfile ? t('modal.preview.title', { name: editingProfile.name }) :
               modalMode === 'add' && addProfileStage === 'selectMethod' ? t('modal.selectMethod.title') :
               modalMode === 'add' && addProfileStage === 'urlInput' ? t('modal.urlInput.title') :
               modalMode === 'add' && addProfileStage === 'analyzingUrl' ? t('modal.analyzing.title') :
               t('modal.manualForm.title') /* Default for manualForm or fallback */
              }
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'edit' ? t('modal.edit.description') :
               modalMode === 'preview' ? t('modal.preview.description') :
               modalMode === 'add' && addProfileStage === 'selectMethod' ? t('modal.selectMethod.description') :
               modalMode === 'add' && addProfileStage === 'urlInput' ? t('modal.urlInput.description') :
               modalMode === 'add' && addProfileStage === 'analyzingUrl' ? t('modal.analyzing.description') :
               t('modal.manualForm.description')
              }
            </DialogDescription>
          </DialogHeader>

          {/* Content based on addProfileStage when modalMode is 'add' */}
          {modalMode === 'add' && (
            <>
              {addProfileStage === 'selectMethod' && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => setAddProfileStage('manualForm')}>
                    <Edit3 className="h-8 w-8 mb-1" />
                    <span>{t('modal.selectMethod.addManually')}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => setAddProfileStage('urlInput')}>
                    <LinkIcon className="h-8 w-8 mb-1" />
                    <span>{t('modal.selectMethod.addViaUrl')}</span>
                  </Button>
                </div>
              )}

              {addProfileStage === 'urlInput' && (
                <div className="space-y-4 py-4 px-6">
                  <div>
                    <Label htmlFor="profileNameUrl" className="block text-sm font-medium text-gray-700 mb-1">{t('modal.urlInput.profileName')}</Label>
                    <Input id="profileNameUrl" value={analysisProfileName} onChange={(e) => setAnalysisProfileName(e.target.value)} className="w-full" placeholder={t('modal.urlInput.profileNamePlaceholder')} disabled={isProcessing}/>
                  </div>
                  <div>
                    <Label htmlFor="articleUrl" className="block text-sm font-medium text-gray-700 mb-1">{t('modal.urlInput.articleUrls')} <span className="text-red-500">{t('modal.urlInput.required')}</span></Label>
                    <Textarea id="articleUrl" value={analysisUrl} onChange={(e) => setAnalysisUrl(e.target.value)} className="w-full min-h-[100px]" placeholder={t('modal.urlInput.articleUrlsPlaceholder')} disabled={isProcessing}/>
                  </div>
                  <DialogFooter className="mt-4 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setAddProfileStage('selectMethod')} disabled={isProcessing} className="mr-auto">
                       {t('buttons.back')}
                    </Button>
                    <Button type="button" variant="outline" onClick={closeModal} disabled={isProcessing}>
                      {t('buttons.cancel')}
                    </Button>
                    <LoadingButton
                      isLoading={isProcessing}
                      normalText={t('buttons.analyzeCreate')}
                      normalIcon={<SearchCheck size={16} />}
                      variant="default"
                      disabled={!analysisUrl.trim()}
                      onClick={handleAnalyzeUrlSubmit}
                      className="flex items-center"
                    />
                  </DialogFooter>
                </div>
              )}

              {addProfileStage === 'analyzingUrl' && (
                <div className="p-6 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                </div>
              )}

              {addProfileStage === 'manualForm' && (
                <>
                  <div className="flex-grow overflow-y-auto p-6 pt-0 min-h-0"> 
                    <StyleProfileForm 
                        key={analyzedProfileData ? 'add-analyzed' : (editingProfile?.id || 'add-manual')} 
                        onSubmit={handleFormSubmit} 
                        initialData={analyzedProfileData || editingProfile || undefined} 
                        isEditMode={!!editingProfile}
                        isProcessing={isProcessing}
                        onCancel={() => {
                          if (analyzedProfileData) {
                            setAnalyzedProfileData(null);
                            setAddProfileStage('urlInput');
                          } else if (editingProfile) {
                            closeModal();
                          } else {
                            setAddProfileStage('selectMethod');
                          }
                        }}
                    />
                  </div>
                  
                  {/* 固定在Dialog底部的按钮区域 */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-white dark:bg-slate-800 flex-shrink-0">
                    <div className="flex justify-end items-center space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          if (analyzedProfileData) {
                            setAnalyzedProfileData(null);
                            setAddProfileStage('urlInput');
                          } else if (editingProfile) {
                            closeModal();
                          } else {
                            setAddProfileStage('selectMethod');
                          }
                        }} 
                        disabled={isProcessing} 
                        className="flex items-center"
                      >
                        <Ban size={16} className="mr-2" /> {t('buttons.cancel')}
                      </Button>
                      <Button 
                        type="submit" 
                        form="styleProfileForm" 
                        disabled={isProcessing} 
                        className="flex items-center"
                      >
                        {isProcessing ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {t('buttons.saveChanges')}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Content for Preview Mode (modalMode is 'preview') */}
          {modalMode === 'preview' && editingProfile && (
            <>
              <div className="flex-grow overflow-y-auto p-6 pt-0 min-h-0"> 
                <StyleProfileForm 
                    key={`preview-${editingProfile.id}`} 
                    onSubmit={() => Promise.resolve()} // Empty function since it's preview mode
                    initialData={editingProfile}
                    isEditMode={false} // Not in edit mode for preview
                    isProcessing={false}
                    isViewMode={true} // 设置为查看模式
                    onCancel={closeModal}
                />
              </div>
              
              {/* 固定在Dialog底部的按钮区域 */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white dark:bg-slate-800 flex-shrink-0">
                <div className="flex justify-end items-center space-x-3">
                  <Button 
                    type="button" 
                    variant="default" 
                    onClick={() => setModalMode('edit')} 
                    className="flex items-center"
                  >
                    <Edit2 size={16} className="mr-2" /> {t('buttons.editProfile')}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal} className="flex items-center">
                    <Ban size={16} className="mr-2" /> {t('buttons.close')}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Content for Edit Mode (modalMode is 'edit') */}
          {modalMode === 'edit' && editingProfile && (
            <>
              <div className="flex-grow overflow-y-auto p-6 pt-0 min-h-0"> 
                <StyleProfileForm 
                    key={editingProfile.id} 
                    onSubmit={handleFormSubmit} 
                    initialData={editingProfile}
                    isEditMode={true}
                    isProcessing={isProcessing}
                    onCancel={closeModal}
                />
              </div>
              
              {/* 固定在Dialog底部的按钮区域 */}
              <div className="px-6 py-4 border-t border-gray-200 bg-white dark:bg-slate-800 flex-shrink-0">
                <div className="flex justify-end items-center space-x-3">
                  <Button type="button" variant="outline" onClick={closeModal} disabled={isProcessing} className="flex items-center">
                    <Ban size={16} className="mr-2" /> {t('buttons.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    form="styleProfileForm" 
                    disabled={isProcessing} 
                    className="flex items-center"
                  >
                    {isProcessing ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                    {t('buttons.saveChanges')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}