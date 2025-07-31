'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface QueueStatus {
  queuedCount: number;
  processingCount: number;
  totalPendingCount: number;
  averageProcessingTimeSeconds: number | null;
  articles: {
    queued: Array<{
      id: string;
      title: string;
      status: string;
      writingPurpose: string[];
      positionInQueue: number;
      estimatedStartTime: string | null;
    }>;
    processing: Array<{
      id: string;
      title: string;
      status: string;
      writingPurpose: string[];
    }>;
  };
  timestamp: string;
}

interface QueueStatusIndicatorProps {
  compact?: boolean;
  showDetails?: boolean;
  collapsible?: boolean; // 新增：是否可折叠
  onQueueStatusChange?: (previousCount: number, currentCount: number) => void; // 新增：队列状态变化回调
}

export default function QueueStatusIndicator({ 
  compact = false, 
  showDetails = false,
  collapsible = false,
  onQueueStatusChange
}: QueueStatusIndicatorProps) {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef<number>(0);
  const t = useTranslations('queue');



  // 初始化和轮询逻辑合并 - 避免重复的fetch函数
  useEffect(() => {
    // 立即执行一次
    const fetchData = async () => {
      try {
        const response = await fetch('/api/articles/queue-status');
        if (!response.ok) {
          throw new Error('Failed to fetch queue status');
        }
        const data: QueueStatus = await response.json();
        
        // 检查队列状态变化
        const previousCount = previousCountRef.current;
        const currentCount = data.totalPendingCount;
        
        // 只有在非首次加载且队列任务数量减少时才触发回调
        if (onQueueStatusChange && previousCount > 0 && currentCount < previousCount) {
          console.log(`Queue count decreased: ${previousCount} -> ${currentCount}. Triggering refresh.`);
          onQueueStatusChange(previousCount, currentCount);
        }
        
        previousCountRef.current = currentCount;
        setQueueStatus(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch queue status');
        console.error('Error fetching queue status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // 立即执行
    fetchData();
    
    // 设置轮询
    const pollInterval = setInterval(fetchData, 5000);
    
    return () => clearInterval(pollInterval);
  }, [onQueueStatusChange]);

  // 处理外部点击关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  if (isLoading) {
    return compact ? (
      <Badge variant="outline" className="animate-pulse">
        {t('loading')}
      </Badge>
    ) : null;
  }

  if (error) {
    return compact ? (
      <Badge variant="destructive">
        <AlertCircle className="w-3 h-3 mr-1" />
        {t('error')}
      </Badge>
    ) : null;
  }

  if (!queueStatus || queueStatus.totalPendingCount === 0) {
    return compact || collapsible ? (
      <Badge variant="secondary" className="bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        {t('allComplete')}
      </Badge>
    ) : null;
  }

  // 可折叠模式：显示为图标按钮
  if (collapsible) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center px-3 py-2 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4 mr-2 text-orange-600" />
          <span className="text-sm font-medium text-orange-700">
            {queueStatus.totalPendingCount}
          </span>
          {queueStatus.averageProcessingTimeSeconds && (
            <span className="ml-1 text-xs text-orange-600 opacity-75">
              ({formatTime(queueStatus.averageProcessingTimeSeconds)})
            </span>
          )}
        </button>
        
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-80 z-50">
            <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    {t('status')}
                  </h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-orange-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">
                      {queueStatus.queuedCount}
                    </div>
                    <div className="text-sm text-orange-600">{t('queued')}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {queueStatus.processingCount}
                    </div>
                    <div className="text-sm text-blue-600">{t('processing')}</div>
                  </div>
                </div>

                {queueStatus.averageProcessingTimeSeconds && (
                  <div className="text-center mb-4 p-2 bg-white rounded border">
                    <div className="text-sm text-gray-600">
                      {t('averageTime')} <span className="font-medium">
                        {formatTime(queueStatus.averageProcessingTimeSeconds)}
                      </span>
                    </div>
                  </div>
                )}

                {queueStatus.articles.processing.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-blue-700 mb-2">{t('currentlyProcessing')}</h4>
                    {queueStatus.articles.processing.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm mb-1">
                        <span className="truncate flex-1">{article.title}</span>
                        <Badge variant="outline" className="ml-2 animate-pulse text-xs">
                          {t('processingDots')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {queueStatus.articles.queued.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-orange-700 mb-2">{t('queueTitle')}</h4>
                    {queueStatus.articles.queued.slice(0, 3).map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm mb-1">
                        <span className="truncate flex-1">{article.title}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            #{article.positionInQueue}
                          </Badge>
                          {article.estimatedStartTime && (
                            <span className="text-xs text-gray-500">
                              ~{new Date(article.estimatedStartTime).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {queueStatus.articles.queued.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        {t('moreInQueue', { count: queueStatus.articles.queued.length - 3 })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <Badge variant="outline" className="bg-orange-50 border-orange-200">
        <Clock className="w-3 h-3 mr-1" />
        {queueStatus.totalPendingCount} {t('pending')}
        {queueStatus.averageProcessingTimeSeconds && (
          <span className="ml-1 text-xs opacity-75">
            (~{formatTime(queueStatus.averageProcessingTimeSeconds)}/article)
          </span>
        )}
      </Badge>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-blue-50 border-orange-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-orange-600" />
            {t('status')}
          </h3>
          <Badge variant="outline" className="text-xs">
            {t('updated', { time: new Date(queueStatus.timestamp).toLocaleTimeString() })}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">
              {queueStatus.queuedCount}
            </div>
            <div className="text-sm text-orange-600">{t('queued')}</div>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {queueStatus.processingCount}
            </div>
            <div className="text-sm text-blue-600">{t('processing')}</div>
          </div>
        </div>

        {queueStatus.averageProcessingTimeSeconds && (
          <div className="text-center mb-4 p-2 bg-white rounded border">
            <div className="text-sm text-gray-600">
              {t('averageTime')} <span className="font-medium">
                {formatTime(queueStatus.averageProcessingTimeSeconds)}
              </span>
            </div>
          </div>
        )}

        {showDetails && (
          <>
            {queueStatus.articles.processing.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-sm text-blue-700 mb-2">{t('currentlyProcessing')}</h4>
                {queueStatus.articles.processing.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm mb-1">
                    <span className="truncate flex-1">{article.title}</span>
                    <Badge variant="outline" className="ml-2 animate-pulse text-xs">
                      {t('processingDots')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {queueStatus.articles.queued.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-orange-700 mb-2">{t('queueTitle')}</h4>
                {queueStatus.articles.queued.slice(0, 3).map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm mb-1">
                    <span className="truncate flex-1">{article.title}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        #{article.positionInQueue}
                      </Badge>
                      {article.estimatedStartTime && (
                        <span className="text-xs text-gray-500">
                          ~{new Date(article.estimatedStartTime).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {queueStatus.articles.queued.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    {t('moreInQueue', { count: queueStatus.articles.queued.length - 3 })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 