'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
// Removed Card, CardContent, CardHeader, CardTitle as they are not used for the main list layout anymore
import PublishFormSteps from './components/PublishFormSteps'; 
import { PublishState } from './types';
import { FilePenLine, Settings2, Send, Search, Loader2, CalendarDays, UserCircle2 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

// Define the type for articles coming from the API
interface ApiArticle {
  id: string;
  title: string;
  status: string; // Should be 'pending publish' or 'published'
  updatedAt: string; // ISO date string
  user?: { username?: string }; // Added: User information for creator display
  // publishedPlatforms and publishedAt are not directly in the API response, adjust UI or API if needed
}

// Dummy article data - in a real app, this would come from an API
// const dummyArticles = [ ... ]; // Will be removed/commented out

// Helper function for status styling - handles lowercase underscore format
const getPublishStatusClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'published':
      return 'bg-green-100 text-green-700 border border-green-300';
    case 'pending_publish':
      return 'bg-purple-100 text-purple-700 border border-purple-300';
    default:
      return 'bg-gray-100 text-gray-600 border border-gray-300';
  }
};

// Helper function to normalize and display status - unified UPPERCASE format
const getDisplayStatus = (status: string, t: ReturnType<typeof useTranslations>) => {
  // Normalize status first
  const normalizedStatus = status.toLowerCase();
  
  // Convert to display format using translations
  if (normalizedStatus === 'pending_publish') {
    return t('status.pending');
  }
  if (normalizedStatus === 'published') {
    return t('status.published');
  }
  
  // For other statuses, use draft as fallback
  return t('status.draft');
};

export default function PublishingListPage() {
  const t = useTranslations('publishing');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showPublishFormForArticleId, setShowPublishFormForArticleId] = useState<string | null>(null);
  const [initialFormState, setInitialFormState] = useState<Partial<PublishState> | undefined>(undefined);
  const [publishingArticleTitle, setPublishingArticleTitle] = useState<string | null>(null);

  // Memoize a stable empty object for initialState fallback
  const stableEmptyInitialState = useMemo(() => ({}), []);

  // Filter and search functionality
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // Filter articles based on status and search term
  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    // Apply status filter - handle lowercase underscore format
    if (statusFilter !== 'all') {
      filtered = filtered.filter(article => {
        const normalizedStatus = article.status.toLowerCase();
        if (statusFilter === 'published') {
          return normalizedStatus === 'published';
        } else if (statusFilter === 'pending_publish') {
          return normalizedStatus === 'pending_publish';
        }
        return false;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [articles, statusFilter, searchTerm]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/publishing/articles');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `${t('error.fetchArticles', { error: response.status })}`);
        }
        const data: ApiArticle[] = await response.json();
        setArticles(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('error.refetchFailed'));
        }
        console.error("Failed to fetch articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [t]);

  const handleStartPublishing = (articleId: string) => {
    const articleToPublish = articles.find(a => a.id === articleId);
    setPublishingArticleTitle(articleToPublish ? articleToPublish.title : 'Article');

    const savedStateRaw = localStorage.getItem(`publishFormState_${articleId}`);
    let loadedState: Partial<PublishState> | undefined = undefined;
    if (savedStateRaw) {
      try {
        loadedState = JSON.parse(savedStateRaw) as Partial<PublishState>;
      } catch (e) {
        console.error("Failed to parse saved state on list page:", e);
        localStorage.removeItem(`publishFormState_${articleId}`);
      }
    }
    setInitialFormState(loadedState);
    setShowPublishFormForArticleId(articleId);
  };

  const handleCancelPublishing = () => {
    setShowPublishFormForArticleId(null);
    setInitialFormState(undefined);
  };

  const handleActualPublish = async (finalState: PublishState) => {
    console.log("Publishing article with data:", finalState);
    
    // This function is now called from PublishFormSteps after the internal API call
    // We just need to clean up the form state and refresh the list
    
    localStorage.removeItem(`publishFormState_${finalState.articleId}`);
    setShowPublishFormForArticleId(null);
    setInitialFormState(undefined);

    // Re-fetch the articles list to show updated status
    setIsLoading(true);
    try {
        const response = await fetch('/api/publishing/articles');
        if (!response.ok) throw new Error(t('error.refetchFailed'));
        const data = await response.json();
        setArticles(data);
    } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError(t('error.reloadFailed'));
    } finally {
        setIsLoading(false);
    }
  };

  const handleTitleClick = (articleId: string) => {
    router.push(`/${locale}/editor/${articleId}`);
  };

  if (showPublishFormForArticleId) {
    return (
        <PublishFormSteps
            articleId={showPublishFormForArticleId}
            articleTitle={publishingArticleTitle}
            initialState={initialFormState || stableEmptyInitialState}
            onCancel={handleCancelPublishing}
            onPublish={handleActualPublish}
        />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]"> 
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="ml-3 text-lg font-semibold text-gray-700 dark:text-gray-300">{t('loading.articles')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold dark:text-slate-100 flex items-center">
            <Send size={28} className="mr-3" /> 
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <p className="text-center py-4 text-red-600">{t('error.fetchArticles', { error })}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold dark:text-slate-100 flex items-center">
          <Send size={28} className="mr-3" /> 
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Action bar above table */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3">
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('filters.status.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.all')}</SelectItem>
              <SelectItem value="pending_publish">{t('filters.status.pendingPublish')}</SelectItem>
              <SelectItem value="published">{t('filters.status.published')}</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder={t('filters.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        
        {/* Batch operations */}
        {selectedArticles.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              {t('table.batch.publish', { count: selectedArticles.length })}
            </Button>
            <Button variant="outline" size="sm">
              {t('table.batch.delete')}
            </Button>
          </div>
        )}
      </div>

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border rounded-lg shadow-sm dark:border-slate-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      {t('table.headers.title')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      {t('table.headers.status')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      {t('table.headers.details')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">
                      {t('table.headers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-slate-700">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                      <tr key={article.id} className={`${article.status.toLowerCase() === 'published' ? 'bg-slate-50 dark:bg-slate-800/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/60'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="text-sm font-medium text-gray-900 dark:text-slate-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            onClick={() => handleTitleClick(article.id)}
                            title="Click to edit article"
                          >
                            {article.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getPublishStatusClass(article.status)}`}>
                            {getDisplayStatus(article.status, t)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                          <div className="flex flex-col">
                            <div className="flex items-center mb-1">
                              <CalendarDays size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs">{new Date(article.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <UserCircle2 size={16} className="mr-2 text-gray-400" />
                              <span className="text-xs truncate">{article.user?.username || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            onClick={() => handleStartPublishing(article.id)} 
                            // Simplified disabled logic, as 'publishedPlatforms' isn't directly available
                            // disabled={article.status.toLowerCase() === 'published'} 
                            size="sm"
                            variant={article.status.toLowerCase() === 'published' ? "outline" : "default"}
                            className="flex items-center"
                          >
                            {article.status.toLowerCase() === 'published' ? 
                              <><Settings2 size={14} className="mr-1.5" /> {t('table.actions.viewSettings')}</> : 
                              <><FilePenLine size={14} className="mr-1.5" /> {t('table.actions.configurePublish')}</>}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-slate-400"> 
                        {/* Adjusted colSpan to 4 */}
                        {articles.length === 0 
                          ? t('table.empty.noArticles')
                          : t('table.empty.noResults')
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}