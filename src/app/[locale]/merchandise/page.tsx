'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import MerchandiseForm from '@/components/merchandise/MerchandiseForm';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// Ensure all necessary icons are imported, including X for TagInput and others for MerchandiseCard
import { PlusCircle, Edit2, Trash2, Search, X, Info, AlertTriangle, CheckCircle, Link2, FileText, ClipboardList, UserCircle2, CalendarDays, UploadCloud, ArrowLeft, Loader2, Package, FileUp, Pencil, Tags as TagsIcon, Type, InfoIcon, Ban, Save } from 'lucide-react';
import { LoadingButton } from '@/components/ui/loading-dialog'; 

interface MerchandiseItem {
  id: string;
  name: string;
  summary: string;
  source: string; 
  sourceType: 'url' | 'file' | 'manual';
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  team?: {
    owner?: {
      username: string;
      id?: string; // id of the team owner (user)
    };
    // Potentially other team details if needed in the future
    // id?: string; // id of the team itself
    // name?: string; // name of the team
  };
  user?: {
    username: string;
  };
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder }) => {
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
        onBlur={handleInputBlur} // Add tag on blur
        placeholder={placeholder || t('tagInput.placeholder')}
        className="w-full"
      />
    </div>
  );
};

const MerchandiseCard: React.FC<{ 
  item: MerchandiseItem;
  onEdit: (item: MerchandiseItem) => void; 
  onDelete: (item: MerchandiseItem) => void;
  onPreview: (item: MerchandiseItem) => void;
  t: any; // Add translation function
}> = ({ item, onEdit, onDelete, onPreview, t }) => {
  const getSourceTypeIcon = (sourceType: MerchandiseItem['sourceType']) => {
    switch (sourceType) {
      case 'url':
        return <Link2 size={14} className="mr-1.5 text-blue-600 dark:text-blue-400" />;
      case 'file':
        return <FileText size={14} className="mr-1.5 text-green-600 dark:text-green-400" />;
      case 'manual':
        return <ClipboardList size={14} className="mr-1.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Info size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full border border-gray-200 dark:border-slate-700 border-t-4 border-green-500/50 cursor-pointer"
      onClick={() => onPreview(item)}
    >
      <div className="flex-grow mb-4 relative pt-8">
        <Package size={24} className="absolute top-0 left-0 text-green-500 opacity-75" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2 truncate" title={item.name}>
          {item.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-3 max-h-20 overflow-hidden overflow-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {item.summary || t('card.noSummary')}
        </p>
        
        <div className="mb-3 text-xs flex items-center">
          {getSourceTypeIcon(item.sourceType)}
          <span className="font-medium text-gray-500 dark:text-slate-400 mr-1 capitalize">{t(`sourceType.${item.sourceType}`)}:</span>
          {item.sourceType === 'url' ? (
            <a href={item.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all truncate" title={item.source} onClick={(e) => e.stopPropagation()}>
              {item.source}
            </a>
          ) : (
            <span className="text-gray-700 dark:text-slate-300 break-all truncate" title={item.sourceType === 'file' ? `File: ${item.source}` : item.source}>{item.source}</span>
          )}
        </div>

        <div className="mb-3">
          {item.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="mr-1 mb-1 text-xs font-normal">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 4 && <Badge variant="outline" className="text-xs font-normal">{t('card.moreItems', { count: item.tags.length - 4 })}</Badge>}
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-slate-700 pt-3 text-xs text-gray-500 dark:text-slate-400 space-y-1.5">
        {item.user?.username && (
          <p className="flex items-center">
            <UserCircle2 size={14} className="mr-1.5 text-sky-600 dark:text-sky-400" /> 
            {t('card.createdBy')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{item.user.username}</span>
          </p>
        )}
        <div className="flex justify-between items-center">
          <p className="flex items-center">
            <CalendarDays size={14} className="mr-1.5 text-green-600 dark:text-green-400" /> 
            {t('card.created')} <span className="font-medium text-gray-700 dark:text-slate-200 ml-1">{new Date(item.createdAt).toLocaleDateString('en-CA')}</span>
          </p>
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}> {/* Prevent card click when clicking action buttons */}
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)} title={t('buttons.edit')}>
              <Edit2 className="h-4 w-4 text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(item)} title={t('buttons.delete')}>
              <Trash2 className="h-4 w-4 text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const initialFormData: Omit<MerchandiseItem, 'id' | 'createdAt'> = {
  name: '',
  summary: '',
  source: '',
  sourceType: 'manual',
  tags: [],
};

export default function MerchandisePage() {
  const { data: session, status: sessionStatus } = useSession();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('merchandise');
  
  const [items, setItems] = useState<MerchandiseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'preview' | null>(null);
  const [editingItem, setEditingItem] = useState<MerchandiseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  type NewItemStage = 'selectMethod' | 'fileInput' | 'urlInput' | 'form' | 'analyzing';
  const [newItemStage, setNewItemStage] = useState<NewItemStage>('selectMethod');
  const [currentFormData, setCurrentFormData] = useState<Omit<MerchandiseItem, 'id' | 'createdAt'>>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<boolean>(false);

  useEffect(() => {
    console.log('[Effect activeTeamId] Current activeTeamId:', activeTeamId);
    if (activeTeamId) {
      fetchMerchandise(activeTeamId); // Removed non-null assertion as activeTeamId is now string | null
    } else if (sessionStatus === 'authenticated' && activeTeamId === null) {
      // If authenticated and still no active team ID after trying to fetch, means user has no teams or fetch failed.
      // Consider setting items to empty or showing a message.
      setItems([]); // Clear items if no active team
      setIsLoading(false); // Ensure loading is stopped
      console.log("No active team ID set, merchandise list will be empty or show a prompt.");
    }
  }, [activeTeamId, sessionStatus]); // Add sessionStatus to dependencies

  // Moved fetchUserTeamsAndSetActive into useEffect to run on session change
  useEffect(() => {
    const fetchUserTeamsAndSetActive = async () => {
      if (sessionStatus === 'authenticated' && session?.user?.id) {
        console.log("Session authenticated, attempting to fetch teams.");
        try {
          const response = await fetch('/api/teams');
          if (response.ok) {
            const teams = await response.json();
            if (teams && teams.length > 0) {
              console.log("Teams fetched successfully, setting active team to:", teams[0].id);
              setActiveTeamId(teams[0].id);
            } else {
              console.log("User has no teams or teams array is empty.");
              setActiveTeamId(null); // Explicitly set to null if no teams
              // Optionally: toast.info("You are not part of any team. Please create or join a team to manage merchandise.");
            }
          } else {
            console.error("Failed to fetch teams, status:", response.status);
            toast.error(t('toast.teamError'));
            setActiveTeamId(null); // Set to null on error
          }
        } catch (error) {
          console.error("Error fetching teams for activeTeamId:", error);
          toast.error(t('toast.teamError'));
          setActiveTeamId(null); // Set to null on error
        }
      } else if (sessionStatus === 'unauthenticated') {
        console.log("Session unauthenticated, cannot fetch teams.");
        setActiveTeamId(null); // Clear active team if session is lost
        setItems([]); // Clear items
      }
    };

    fetchUserTeamsAndSetActive();
  }, [session, sessionStatus]); // Depend on session and sessionStatus

  const fetchMerchandise = async (teamId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching merchandise for teamId: ${teamId}`);
      const response = await fetch(`/api/merchandise?teamId=${teamId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch merchandise: ${response.status}`);
      }
      const data: MerchandiseItem[] = await response.json();
      setItems(data);
    } catch (err: any) {
      console.error("Fetch merchandise error:", err);
      setError(t('toast.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      if (editingItem) {
        console.log('[Effect isModalOpen/editingItem] Editing item data:', editingItem);
        setCurrentFormData({
          name: editingItem.name,
          summary: editingItem.summary,
          source: editingItem.source,
          sourceType: editingItem.sourceType,
          tags: editingItem.tags || [],
        });
        setNewItemStage('form');
      } else {
        setCurrentFormData(initialFormData);
        setSelectedFile(null);
        setInputUrl('');
        if (fileInputRef.current) fileInputRef.current.value = "";
        setNewItemStage('selectMethod');
      }
    } else {
      setNewItemStage('selectMethod'); 
    }
  }, [isModalOpen, editingItem]);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (tags: string[]) => {
    setCurrentFormData(prev => ({ ...prev, tags }));
  };

  const handleSourceTypeChangeInForm = (value: 'manual' | 'url' | 'file') => {
    setCurrentFormData(prev => ({ ...prev, sourceType: value, source: '' }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const simulateDifyAnalysis = (sourceData: string, type: 'file' | 'url') => {
    setNewItemStage('analyzing');
    setTimeout(() => {
      setCurrentFormData({
        name: type === 'file' ? sourceData.split('.').slice(0, -1).join('.') : `Content from ${sourceData}`,
        summary: `This is an auto-generated summary for ${sourceData}. Lorem ipsum dolor sit amet. (Processed by Dify - simulated)`, 
        source: sourceData,
        sourceType: type,
        tags: ['auto-analyzed', type, 'dify-content']
      });
      setNewItemStage('form');
    }, 1500);
  };

  const handleAnalyzeFile = async () => {
    if (!selectedFile) {
      toast.error(t('toast.noFileSelected'));
      return;
    }
    if (!activeTeamId) {
      toast.error(t('toast.teamError'));
      return;
    }
    if (!session?.user?.email) {
      toast.error(t('toast.sessionError'));
      return;
    }
    const currentUserEmail = session.user.email;

    setNewItemStage('analyzing');
    setIsAnalyzingFile(true);

    try {
      // 第一步：上传文件到Dify（通过服务端API）
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile, selectedFile.name);

      console.log(`Uploading ${selectedFile.name} to server API for Dify upload by user: ${currentUserEmail}`);
      const uploadResponse = await fetch('/api/merchandise/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: t('toast.analysisError') }));
        throw new Error(errorData.error || `File upload failed: ${uploadResponse.statusText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('File uploaded successfully:', uploadResult);

      // 第二步：使用上传结果调用分析API
      const backendFormData = new FormData();
      backendFormData.append('dify_file_json_string', JSON.stringify(uploadResult.difyFileObject));
      backendFormData.append('teamId', activeTeamId);

      console.log("Calling backend /api/merchandise/analyze with uploaded file object.");
      const analyzeResponse = await fetch('/api/merchandise/analyze', {
        method: 'POST',
        body: backendFormData,
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({ error: t('toast.analysisError') }));
        throw new Error(errorData.error || `Backend analysis call failed: ${analyzeResponse.statusText}`);
      }

      const result = await analyzeResponse.json();
      // 生成带时间戳的默认名称，避免重复
      const timestamp = new Date().getTime();
      const baseFileName = selectedFile.name ? selectedFile.name.split('.').slice(0, -1).join('.') : 'Analyzed File';
      const defaultName = `${baseFileName}_${timestamp}`;
      
      setCurrentFormData({
        name: defaultName,
        summary: result.summary || t('form.summary.noSummary'),
        source: selectedFile.name || 'unknown_file', // Use original selected file's name
        sourceType: 'file',
        tags: Array.isArray(result.tags) && result.tags.length > 0 ? result.tags : []
      });
      setNewItemStage('form');
      toast.success(t('toast.analysisSuccess'));

    } catch (err: any) {
      console.error("Error in handleAnalyzeFile:", err);
      toast.error(`${t('toast.analysisError')}: ${err.message}`);
      setNewItemStage('fileInput');
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!inputUrl || !(inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
      toast.error(t('toast.invalidUrl'));
      return;
    }
    if (!activeTeamId) {
      toast.error(t('toast.teamError'));
      return;
    }

    setNewItemStage('analyzing');
    try {
      const backendFormData = new FormData();
      backendFormData.append('sourceUrl', inputUrl);
      backendFormData.append('teamId', activeTeamId);

      const response = await fetch('/api/merchandise/analyze', {
        method: 'POST',
        body: backendFormData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: t('toast.analysisError') }));
        throw new Error(errorData.error || `Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      // 生成带时间戳的默认名称，避免重复
      const timestamp = new Date().getTime();
      const baseUrlName = `Analyzed from ${inputUrl.substring(0, 50)}${inputUrl.length > 50 ? '...' : ''}`;
      const defaultName = `${baseUrlName}_${timestamp}`;
      
      setCurrentFormData({
        name: defaultName,
        summary: result.summary || t('form.summary.noSummary'), 
        source: inputUrl,
        sourceType: 'url',
        tags: Array.isArray(result.tags) && result.tags.length > 0 ? result.tags : []
      });
      setNewItemStage('form');
      toast.success(t('toast.analysisSuccess'));
    } catch (err: any) {
      console.error("Error analyzing URL:", err);
      toast.error(`${t('toast.analysisError')}: ${err.message}`);
      setNewItemStage('urlInput');
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setCurrentFormData(initialFormData);
    setNewItemStage('selectMethod'); 
    setInputUrl('');
    setSelectedFile(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search logic is typically handled by useEffect on searchTerm, or a direct call to loadItems if needed.
    // This primarily prevents default form action.
    console.log("Search submitted with term:", searchTerm);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MerchandiseItem) => {
    console.log('[handleEditItem] Clicked edit for item:', item);
    setEditingItem(item);
    setCurrentFormData(item);
    setNewItemStage('form');
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handlePreviewItem = (item: MerchandiseItem) => {
    setEditingItem(item);
    setModalMode('preview');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingItem(null);
    setIsModalOpen(false);
    setNewItemStage('selectMethod'); // 重置新建阶段状态
  };

  const handleDeleteItem = (itemToDelete: MerchandiseItem) => {
    if (window.confirm(t('deleteConfirm.title', { name: itemToDelete.name }))) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      toast.success(t('toast.deleteSuccess'));
    }
  };

  const handleFormSubmit = async (formData?: any) => {
    // 使用传入的formData，如果没有则使用currentFormData
    const dataToSubmit = formData || currentFormData;
    
    if (!activeTeamId) {
      toast.error(t('toast.teamError'));
      return;
    }

    if (!dataToSubmit.name.trim()) {
      toast.error(t('form.validation.nameRequired'));
      return;
    }
    // Add other client-side validations as needed, e.g., for sourceType if it's not 'manual'
    if (dataToSubmit.sourceType === 'url' && !dataToSubmit.source) {
      toast.error(t('toast.invalidUrl'));
      return;
    }
    // For file type, selectedFile should ideally be handled or validated here if it's a separate flow

    setIsSubmitting(true);

    const payload = {
      ...dataToSubmit,
      teamId: activeTeamId, // Include activeTeamId in the payload
    };

    try {
      const response = await fetch(editingItem ? `/api/merchandise/${editingItem.id}` : '/api/merchandise', {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newMerchandiseItem = await response.json();
        toast.success(t(editingItem ? 'toast.updateSuccess' : 'toast.createSuccess'));
        // 使用closeModal()来完全重置所有状态，而不是只关闭modal
        closeModal();
        if (activeTeamId) { 
          fetchMerchandise(activeTeamId); // Use non-null assertion
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || t(editingItem ? 'toast.updateError' : 'toast.createError'));
      }
    } catch (err: any) {
      console.error("Detailed error in handleFormSubmit:", err); // Log the full error object
      // Attempt to log server response if available
      if (err.message && err.message.includes('Failed to create merchandise') && !err.response) {
        // This case might indicate the error was thrown before a detailed server response could be parsed, or it's a generic client-side error.
        console.warn("Error was likely thrown client-side or server response was not standard JSON.");
      }
      // It's tricky to get response body from a generic Error object directly after response.json() might have failed or if it's not a fetch error.
      // The error thrown at line 523 already tries to incorporate server's error message.
      toast.error(err.message || t(editingItem ? 'toast.updateError' : 'toast.createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const renderFormFields = () => {
    const sourceLabel = currentFormData.sourceType === 'url' ? t('form.source.labels.url') : 
                        currentFormData.sourceType === 'file' ? t('form.source.labels.file') : t('form.source.labels.manual');
    const sourcePlaceholder = currentFormData.sourceType === 'url' ? t('form.source.placeholders.url') : 
                              currentFormData.sourceType === 'file' ? t('form.source.placeholders.file') : t('form.source.placeholders.manual');

    return (
      <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
            <Package size={14} className="mr-1.5 text-blue-600" /> {t('form.name.label')} <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={currentFormData.name}
            onChange={handleFormInputChange}
            placeholder={t('form.name.placeholder')}
            required
            disabled={isSubmitting || isAnalyzingFile || (currentFormData.sourceType === 'file' && !!selectedFile) || (currentFormData.sourceType === 'url' && !!inputUrl) }
          />
        </div>
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
            <FileText size={14} className="mr-1.5 text-green-600" /> {t('form.summary.label')}
          </label>
          <Textarea
            id="summary"
            name="summary"
            value={currentFormData.summary}
            onChange={handleFormInputChange}
            placeholder={t('form.summary.placeholder')}
            rows={4}
            disabled={isSubmitting || isAnalyzingFile || (currentFormData.sourceType === 'file' && !!selectedFile) || (currentFormData.sourceType === 'url' && !!inputUrl) }
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
            {currentFormData.sourceType === 'url' ? <Link2 size={14} className="mr-1.5 text-purple-600" /> : 
             currentFormData.sourceType === 'file' ? <FileUp size={14} className="mr-1.5 text-purple-600" /> : 
             <Pencil size={14} className="mr-1.5 text-purple-600" />}
            {sourceLabel} <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            id="source"
            name="source"
            value={currentFormData.source}
            onChange={handleFormInputChange}
            placeholder={sourcePlaceholder}
            required
            disabled={isSubmitting || isAnalyzingFile || (currentFormData.sourceType === 'file' && !!selectedFile) || (currentFormData.sourceType === 'url' && !!inputUrl)}
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center">
            <TagsIcon size={14} className="mr-1.5 text-orange-600" /> {t('form.tags.label')}
          </label>
          <TagInput 
            value={currentFormData.tags}
            onChange={handleTagsChange}
            placeholder={t('form.tags.placeholder')}
          />
           <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 px-1">
            {t('tagInput.hint')}
          </p>
        </div>
      </div>
    );
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
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] text-center p-6 bg-red-50 dark:bg-red-900/10 rounded-lg">
        <AlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-2">{t('error.title')}</h2>
        <p className="text-md text-gray-700 dark:text-slate-300 mb-6 whitespace-pre-wrap">{error}</p>
        <Button onClick={() => activeTeamId && fetchMerchandise(activeTeamId)} disabled={isLoading || !activeTeamId} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" /> {t('error.tryAgain')}
        </Button>
        {!activeTeamId && <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">{t('error.noTeam')}</p>}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster richColors position="top-right" />
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 flex items-center">
            <Package size={28} className="mr-3 text-green-600" />
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('subtitle')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button onClick={handleOpenAddModal} className="flex items-center whitespace-nowrap" disabled={isSubmitting || isLoading}>
            <PlusCircle size={16} className="mr-2" /> {t('buttons.newMerchandise')}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50 dark:bg-slate-800/30">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
            <Input
              type="search"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-slate-700/50"
            />
          </div>
        </form>
      </div>

      {!isLoading && !error && filteredItems.length === 0 && (
        <div className="text-center py-10">
          <FileText className="mx-auto h-16 w-16 text-gray-400 dark:text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-slate-200">
            {searchTerm ? t('emptyState.withSearch') : t('emptyState.withoutSearch')}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {searchTerm ? t('emptyState.searchHint') : t('emptyState.addHint')}
          </p>
        </div>
      )}

      {!isLoading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MerchandiseCard key={item.id} item={item} onEdit={handleEditItem} onDelete={handleDeleteItem} onPreview={handlePreviewItem} t={t} />
          ))}
        </div>
      )}
      
      {/* Unified Dialog for Add/Edit/Preview */}
      <Dialog 
        open={modalMode === 'add' || modalMode === 'edit' || modalMode === 'preview'} 
        onOpenChange={(open) => { if (!open) closeModal(); }}
      >
        <DialogContent 
            className={
                modalMode === 'edit' || modalMode === 'preview' || (modalMode === 'add' && newItemStage === 'form')
                ? "sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1200px] w-[90vw] max-h-[90vh] flex flex-col p-0" // 统一与style弹窗的尺寸
                : modalMode === 'add' && newItemStage === 'urlInput'
                  ? "sm:max-w-[600px] md:max-w-[750px] max-h-[90vh] flex flex-col" // 统一高度为90vh并添加flex
                  : modalMode === 'add' && newItemStage === 'analyzing'
                    ? "sm:max-w-[550px] max-h-[450px] flex flex-col" // 统一analyzing弹窗尺寸并添加flex
                    : "sm:max-w-[550px] max-h-[90vh] flex flex-col" // 统一高度为90vh并添加flex
            }
        >
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>
              {modalMode === 'edit' && editingItem ? t('modal.edit.title', { name: editingItem.name }) :
               modalMode === 'preview' && editingItem ? t('modal.preview.title', { name: editingItem.name }) :
               modalMode === 'add' && newItemStage === 'selectMethod' ? t('modal.add.selectMethod.title') :
               modalMode === 'add' && newItemStage === 'fileInput' ? t('modal.add.fileInput.title') :
               modalMode === 'add' && newItemStage === 'urlInput' ? t('modal.add.urlInput.title') :
               modalMode === 'add' && newItemStage === 'analyzing' ? t('modal.add.analyzing.title') :
               t('modal.add.form.title')
              }
            </DialogTitle>
            <DialogDescription>
              {modalMode === 'edit' ? t('modal.edit.description') :
               modalMode === 'preview' ? t('modal.preview.description') :
               modalMode === 'add' && newItemStage === 'selectMethod' ? t('modal.add.selectMethod.description') :
               modalMode === 'add' && newItemStage === 'fileInput' ? t('modal.add.fileInput.description') :
               modalMode === 'add' && newItemStage === 'urlInput' ? t('modal.add.urlInput.description') :
               modalMode === 'add' && newItemStage === 'analyzing' ? t('modal.add.analyzing.description') :
               t('modal.add.form.description')
              }
            </DialogDescription>
          </DialogHeader>

          {/* Content based on modalMode */}
          {modalMode === 'add' && (
            <>
              {newItemStage === 'analyzing' && (
                  <div className="p-6 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                  </div>
              )}

              {newItemStage === 'selectMethod' && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => { setCurrentFormData({...initialFormData, sourceType: 'manual'}); setNewItemStage('form'); }}>
                    <Edit2 className="h-8 w-8 mb-1" />
                    <span>{t('modal.add.selectMethod.enterManually')}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => setNewItemStage('fileInput') }>
                    <FileText className="h-8 w-8 mb-1" />
                    <span>{t('modal.add.selectMethod.analyzeFromFile')}</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2" onClick={() => setNewItemStage('urlInput') }>
                    <Link2 className="h-8 w-8 mb-1" />
                    <span>{t('modal.add.selectMethod.analyzeFromUrl')}</span>
                  </Button>
                </div>
              )}

              {newItemStage === 'fileInput' && (
                  <div className="space-y-4 py-4 px-6">
                      <div>
                          <label htmlFor="fileUploadTrigger" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{t('modal.add.fileInput.uploadFile')}</label>
                          <Input 
                            id="fileUpload" 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                            className="hidden"
                            accept=".pdf"
                          />
                          <Button 
                            id="fileUploadTrigger"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()} 
                            className="w-full mb-1"
                          >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            {t('modal.add.fileInput.uploadButton')}
                          </Button>
                          <p className="text-xs text-gray-500 dark:text-slate-400 px-1">
                            {t('modal.add.fileInput.uploadHint')}
                          </p>
                          {selectedFile && <p className="text-xs text-green-600 dark:text-green-400 mt-2 px-1">{t('modal.add.fileInput.selected', { filename: selectedFile.name })}</p>}
                      </div>
                      <DialogFooter className="mt-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setNewItemStage('selectMethod')} disabled={isAnalyzingFile} className="mr-auto">
                           {t('buttons.back')}
                        </Button>
                        <Button type="button" variant="outline" onClick={closeModal} disabled={isAnalyzingFile}>
                          {t('buttons.cancel')}
                        </Button>
                        <LoadingButton
                          isLoading={isAnalyzingFile}
                          normalText={t('buttons.analyzeFile')}
                          normalIcon={<FileText size={16} />}
                          variant="default"
                          disabled={!selectedFile}
                          onClick={handleAnalyzeFile}
                          className="flex items-center"
                        />
                      </DialogFooter>
                  </div>
              )}

              {newItemStage === 'urlInput' && (
                  <div className="space-y-4 py-4 px-6">
                      <div>
                          <label htmlFor="urlForAnalysis" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('modal.add.urlInput.enterUrl')}</label>
                          <Input id="urlForAnalysis" type="url" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder={t('modal.add.urlInput.placeholder')} className="w-full" disabled={isSubmitting}/>
                      </div>
                      <DialogFooter className="mt-4 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setNewItemStage('selectMethod')} disabled={isSubmitting} className="mr-auto">
                           {t('buttons.back')}
                        </Button>
                        <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
                          {t('buttons.cancel')}
                        </Button>
                        <Button type="button" onClick={handleAnalyzeUrl} disabled={!inputUrl || isSubmitting} className="flex items-center">
                          {isSubmitting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Link2 size={16} className="mr-2" />}
                          {t('buttons.analyzeUrl')}
                        </Button>
                      </DialogFooter>
                  </div>
              )}

              {newItemStage === 'form' && (
                <>
                  <div className="flex-1 overflow-hidden p-6 pt-0"> 
                    <MerchandiseForm 
                        key={editingItem?.id || 'add-manual'} 
                        onSubmit={async (data) => {
                          await handleFormSubmit(data);
                        }} 
                        initialData={currentFormData}
                        isEditMode={!!editingItem} 
                        isProcessing={isSubmitting}
                        onCancel={() => {
                          setNewItemStage('selectMethod');
                        }}
                    />
                  </div>
                  
                  {/* 固定在Dialog底部的按钮区域 */}
                  <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 rounded-b-lg">
                    <div className="flex justify-end items-center space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setNewItemStage('selectMethod');
                        }} 
                        disabled={isSubmitting} 
                        className="flex items-center"
                      >
                        <Ban size={16} className="mr-2" /> {t('buttons.cancel')}
                      </Button>
                      <Button 
                        type="submit" 
                        form="merchandiseForm" 
                        disabled={isSubmitting} 
                        className="flex items-center"
                      >
                        {isSubmitting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
                        {t('buttons.createMerchandise')}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Content for Preview Mode (modalMode is 'preview') */}
          {modalMode === 'preview' && editingItem && (
            <>
              <div className="flex-1 overflow-hidden p-6 pt-0"> 
                <MerchandiseForm 
                    key={`preview-${editingItem.id}`} 
                    onSubmit={() => Promise.resolve()} // Empty function since it's preview mode
                    initialData={editingItem}
                    isEditMode={true} // 现在统一使用编辑模式，预览由MarkdownEditor内部提供
                    isProcessing={false}
                    isViewMode={true} // 设置为查看模式
                    onCancel={closeModal}
                />
              </div>
              
              {/* 固定在Dialog底部的按钮区域 */}
              <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 rounded-b-lg">
                <div className="flex justify-end items-center space-x-3">
                  <Button 
                    type="button" 
                    variant="default" 
                    onClick={() => setModalMode('edit')} 
                    className="flex items-center"
                  >
                    <Edit2 size={16} className="mr-2" /> {t('buttons.edit')}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal} className="flex items-center">
                    <Ban size={16} className="mr-2" /> {t('buttons.close')}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Content for Edit Mode (modalMode is 'edit') */}
          {modalMode === 'edit' && editingItem && (
            <>
              <div className="flex-1 overflow-hidden p-6 pt-0"> 
                <MerchandiseForm 
                    key={editingItem.id} 
                    onSubmit={async (data) => {
                      await handleFormSubmit(data);
                    }} 
                    initialData={editingItem}
                    isEditMode={true}
                    isProcessing={isSubmitting}
                    onCancel={closeModal}
                />
              </div>
              
              {/* 固定在Dialog底部的按钮区域 */}
              <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 rounded-b-lg">
                <div className="flex justify-end items-center space-x-3">
                  <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting} className="flex items-center">
                    <Ban size={16} className="mr-2" /> {t('buttons.cancel')}
                  </Button>
                  <Button 
                    type="submit" 
                    form="merchandiseForm" 
                    disabled={isSubmitting} 
                    className="flex items-center"
                  >
                    {isSubmitting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
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