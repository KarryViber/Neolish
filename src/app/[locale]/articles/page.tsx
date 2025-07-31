"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import NewArticleDialog from "@/components/articles/NewArticleDialog";
import QueueStatusIndicator from '@/components/QueueStatusIndicator';
import { Tooltip } from '@/components/ui/tooltip';
import Link from 'next/link';
import { CalendarDays, PlusCircle, FilePenLine, ArchiveIcon, Search, ChevronLeft, ChevronRight, UserCircle2, Loader2, AlertTriangle, Newspaper, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Define actual Article type expected from API (match Prisma model)
interface ArticleFromAPI {
  id: string;
  title: string;
  status: string; // Now can be: 'draft', 'published', 'archived', 'queued', 'processing', 'generation_failed'
  writingPurpose: string[]; // Assuming array of strings based on schema
  writingPurposeDisplay?: string; 
  // targetAudienceIds: string[]; // If needed for display, add here
  // For simplicity, display info might come differently or not shown directly in list
  targetAudienceDisplay?: string; // Example: Might get primary audience name from API
  updatedAt: string; // ISO date string
  content?: string; // To hold error messages or snippets if generation_failed or for previews
  outline?: { title?: string }; // Assuming outline title might be included
  styleProfile?: { name?: string }; // Assuming style profile name might be included
  user?: { username?: string }; // Added: User information
}

// Placeholder function for actual API call to fetch articles
async function fetchArticlesFromAPI(
  searchTerm: string,
  statusFilter: string,
  purposeFilter: string,
  audienceFilter: string,
  currentPage: number,
  articlesPerPage: number
): Promise<{ articles: ArticleFromAPI[], totalCount: number }> {
  console.log(`Fetching articles from API: term=${searchTerm}, status=${statusFilter}, purpose=${purposeFilter}, audience=${audienceFilter}, page=${currentPage}, limit=${articlesPerPage}`);
  // TODO: Implement actual API call to GET /api/articles with query parameters
  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: articlesPerPage.toString(),
    searchTerm,
    status: statusFilter,
    purpose: purposeFilter,
    audience: audienceFilter,
  });

  try {
    const response = await fetch(`/api/articles?${queryParams.toString()}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch articles: ${response.statusText}`);
    }
    const data = await response.json();
    // TODO: Validate data structure matches { articles: ArticleFromAPI[], totalCount: number }
    return data as { articles: ArticleFromAPI[], totalCount: number };
  } catch (error) {
    console.error("API Error fetching articles:", error);
    throw error; // Re-throw error to be caught in loadArticles
  }
}

export default function ArticlesPage() {
  const t = useTranslations('articles');
  
  const [articles, setArticles] = useState<ArticleFromAPI[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [purposeFilter, setPurposeFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const articlesPerPage = 10; 

  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);

  // Updated loadArticles to use the new API fetcher
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null); 
    
    try {
      const { articles: fetchedArticles, totalCount } = await fetchArticlesFromAPI(
        searchTerm,
        statusFilter,
        purposeFilter,
        audienceFilter,
        currentPage,
        articlesPerPage
      );
      setArticles(fetchedArticles);
      setTotalArticles(totalCount);
    } catch (error: any) {
      console.error("Error loading articles:", error);
      const errorMessage = error.message || t('error.fetchFailed');
      toast.error(errorMessage);
      setError(errorMessage); 
      setArticles([]); 
      setTotalArticles(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter, purposeFilter, audienceFilter, currentPage, articlesPerPage, t]); 

  useEffect(() => {
    loadArticles(); 
  }, [loadArticles]);

  // handleSearchSubmit now implicitly triggers loadArticles via state change -> useEffect
  const handleSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setCurrentPage(1); 
    // loadArticles(); 
  };
  
  const handleArticleCreated = () => {
    setCurrentPage(1); 
    loadArticles(); 
    // Toast for creation started is now handled by NewArticleDialog upon 202 response
  };

  // 处理队列状态变化的回调
  const handleQueueStatusChange = useCallback((previousCount: number, currentCount: number) => {
    // 当队列任务数量减少时，说明有任务完成，刷新文章列表以获取最新状态
    console.log(`[Articles Page] Queue status changed: ${previousCount} -> ${currentCount}. A task has been completed, refreshing articles list.`);
    loadArticles();
  }, [loadArticles]);

  // handleArchiveAction remains the same, but should eventually call a real API
  const handleArchiveAction = async (articleId: string, articleTitle: string) => {
    if (window.confirm(t('archive.confirm', { title: articleTitle }))) {
      toast.promise(
        fetch(`/api/articles/${articleId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'archived' }), 
        }).then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Failed to archive article (HTTP ${response.status})`);
          }
          return response.json();
        }).then(() => {
          loadArticles(); 
        }),
        {
          loading: t('archive.loading'),
          success: t('archive.success', { title: articleTitle }),
          error: (err) => err.message || t('error.archiveFailed'),
        }
      );
    }
  };

  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  // Helper function to format status display consistently
  const getStatusDisplayName = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending_publish':
        return t('statusDisplay.pending_publish');
      case 'generation_failed':
        return t('statusDisplay.generation_failed');
      case 'published':
        return t('statusDisplay.published');
      case 'draft':
        return t('statusDisplay.draft');
      case 'archived':
        return t('statusDisplay.archived');
      case 'queued':
        return t('statusDisplay.queued');
      case 'processing':
        return t('statusDisplay.processing');
      default:
        return status.toUpperCase().replace('_', ' ');
    }
  };

  const getStatusClass = (status: ArticleFromAPI['status']) => {
    console.log("[getStatusClass] Received status:", status); 
    let classes = '';
    switch (status?.toLowerCase()) { 
      case 'published': classes = 'bg-green-100 text-green-700 border border-green-300'; break;
      case 'draft': classes = 'bg-yellow-100 text-yellow-700 border border-yellow-300'; break;
      case 'archived': classes = 'bg-gray-100 text-gray-600 border border-gray-300'; break;
      case 'queued': classes = 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse'; break;
      case 'processing': classes = 'bg-blue-100 text-blue-700 border border-blue-300 animate-pulse'; break;
      case 'generation_failed': classes = 'bg-red-100 text-red-700 border border-red-300'; break;
      case 'pending_publish': classes = 'bg-purple-100 text-purple-700 border border-purple-300'; break;
      default: 
        classes = 'bg-indigo-100 text-indigo-700 border border-indigo-300'; 
        console.log(`[getStatusClass] Status '${status}' fell into default case.`); 
        break;
    }
    console.log("[getStatusClass] Returning classes:", classes, "for status:", status);
    return classes;
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
        <Button onClick={() => loadArticles()} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" /> {t('error.tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster richColors position="top-right" />
      <div className="mb-4 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold flex items-center">
            <Newspaper size={28} className="mr-3" /> 
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{t('subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <QueueStatusIndicator collapsible onQueueStatusChange={handleQueueStatusChange} />
          <Button onClick={() => setIsNewArticleModalOpen(true)} className="flex items-center">
            <PlusCircle size={16} className="mr-2" /> {t('buttons.newArticle')}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-end md:gap-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex-grow min-w-[200px]">
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">{t('filters.titleSearch')}</label>
            <Input
              id="searchTerm"
              type="search"
              placeholder={t('filters.titlePlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-grow min-w-[150px]">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('filters.status')}</label>
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); /* loadArticles(); */ }}>
              <SelectTrigger id="statusFilter">
                <SelectValue placeholder={t('filters.statusPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">{t('statusOptions.all')}</SelectItem>
                <SelectItem value="queued">{t('statusOptions.queued')}</SelectItem>
                <SelectItem value="processing">{t('statusOptions.processing')}</SelectItem>
                <SelectItem value="draft">{t('statusOptions.draft')}</SelectItem>
                <SelectItem value="pending_publish">{t('statusOptions.pendingPublish')}</SelectItem>
                <SelectItem value="published">{t('statusOptions.published')}</SelectItem>
                <SelectItem value="archived">{t('statusOptions.archived')}</SelectItem>
                <SelectItem value="generation_failed">{t('statusOptions.generationFailed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow min-w-[200px]">
            <label htmlFor="purposeFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('filters.writingPurpose')}</label>
            <Input
              id="purposeFilter"
              type="search"
              placeholder={t('filters.purposePlaceholder')}
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
            />
          </div>

          <div className="flex-grow min-w-[200px]">
            <label htmlFor="audienceFilter" className="block text-sm font-medium text-gray-700 mb-1">{t('filters.audience')}</label>
            <Input
              id="audienceFilter"
              type="search"
              placeholder={t('filters.audiencePlaceholder')}
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-end gap-2 pt-5 md:pt-0">
            <Button type="submit" className="w-full md:w-auto flex items-center">
              <Search size={16} className="mr-2" /> {t('buttons.search')}
            </Button>
          </div>
        </form>
      </div>
      {isLoading && <p className="text-center py-10 text-gray-500">{t('loadingListing')}</p>}
      {!isLoading && articles.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">{t('emptyState.noArticles')}</p>
          {(searchTerm || statusFilter !== 'All' || purposeFilter || audienceFilter) && 
            <p className="text-sm text-gray-400 mt-2">{t('emptyState.adjustFilters')}</p>}
        </div>
      )}
      {!isLoading && articles.length > 0 && (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="w-[35%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.headers.title')}</th>
                <th scope="col" className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.headers.status')}</th>
                <th scope="col" className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.headers.writingPurpose')}</th>
                <th scope="col" className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.headers.targetAudience')}</th>
                <th scope="col" className="w-[11%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.headers.details')}</th> 
                <th scope="col" className="w-[12%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.headers.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-800 dark:divide-slate-700">
              {articles.map((article) => {
                const normalizedStatus = article.status.toLowerCase(); 
                return (
                  <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 w-[35%]">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 min-w-0">
                          {(normalizedStatus === 'queued' || normalizedStatus === 'processing' || normalizedStatus === 'generation_failed') ? (
                            <div className="text-sm font-medium text-gray-500 block truncate cursor-not-allowed">
                              {article.title}
                            </div>
                          ) : (
                            <Link 
                              href={`/editor/${article.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-indigo-600 hover:underline transition-all cursor-pointer block truncate"
                            >
                              {article.title}
                            </Link>
                          )}
                          {normalizedStatus === 'processing' && (
                            <p className="text-xs text-blue-600 mt-1">{t('table.statusMessages.processing')}</p>
                          )}
                          {normalizedStatus === 'queued' && (
                            <p className="text-xs text-orange-600 mt-1">{t('table.statusMessages.queued')}</p>
                          )}
                          {normalizedStatus === 'generation_failed' && (
                            <p className="text-xs text-red-600 mt-1">{t('table.statusMessages.generationFailed')}</p>
                          )}
                        </div>
                        {normalizedStatus === 'generation_failed' && article.content && (
                          <Tooltip content={article.content}>
                            <AlertCircle className="w-4 h-4 text-red-500 cursor-help flex-shrink-0" />
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap w-[12%]">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(normalizedStatus)}`}>
                        {getStatusDisplayName(article.status)}
                      </span>
                    </td>
                    {/* Display writing purposes - join array for simplicity */}
                    <td className="px-6 py-4 w-[15%]">
                      <div className="text-sm text-gray-700 truncate">
                        {article.writingPurposeDisplay || (article.writingPurpose || []).join(', ')}
                      </div>
                    </td>
                    {/* Display audience - Placeholder, needs data from API */}
                    <td className="px-6 py-4 w-[15%]">
                      <div className="text-sm text-gray-700 truncate">
                        {article.targetAudienceDisplay || t('table.noData')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400 w-[11%]">
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <CalendarDays size={16} className="mr-2 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs">{new Date(article.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <UserCircle2 size={16} className="mr-2 text-gray-400" />
                          <span className="text-xs truncate">{article.user?.username || t('table.noData')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[12%]">
                      <div className="flex items-center space-x-1">
                        {(normalizedStatus === 'queued' || normalizedStatus === 'processing' || normalizedStatus === 'generation_failed') ? (
                          <Tooltip content={
                            normalizedStatus === 'generation_failed' 
                              ? t('table.statusMessages.cannotEditGenFailed')
                              : t('table.statusMessages.beingGenerated')
                          }>
                            <div className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-gray-400 bg-gray-200 cursor-not-allowed">
                              <FilePenLine size={14} />
                            </div>
                          </Tooltip>
                        ) : (
                          <Tooltip content={t('buttons.edit')}>
                            <Link
                              href={`/editor/${article.id}`}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                              <FilePenLine size={14} />
                            </Link>
                          </Tooltip>
                        )}
                        {normalizedStatus !== 'archived' && (normalizedStatus !== 'queued' && normalizedStatus !== 'processing' && normalizedStatus !== 'generation_failed') && (
                          <Tooltip content={t('buttons.archive')}>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleArchiveAction(article.id, article.title)}
                              className="text-xs p-1 h-auto"
                            >
                              <ArchiveIcon size={14} />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} className="mr-1" /> {t('buttons.previous')}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                disabled={isLoading}
                variant={currentPage === pageNumber ? 'default' : 'outline'}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              {t('buttons.next')} <ChevronRight size={16} className="ml-1" />
            </Button>
          </nav>
        </div>
      )}
      <NewArticleDialog 
        isOpen={isNewArticleModalOpen} 
        onClose={() => setIsNewArticleModalOpen(false)} 
        onArticleCreated={handleArticleCreated} 
      />
    </div>
  );
} 