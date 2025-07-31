import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

// 受众接口定义，与OutlineForm中的保持一致
interface AudienceInOutline {
  id: string;
  name: string;
  type?: string | null;
  description?: string | null;
  tags?: string[] | null;
}

interface OutlineAudienceLink {
  audience: AudienceInOutline;
}

interface AudienceDetailsDialogProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 关闭弹窗的回调 */
  onOpenChange: (open: boolean) => void;
  /** 受众列表 */
  audiences: OutlineAudienceLink[];
  /** 大纲标题，用于弹窗标题 */
  outlineTitle?: string;
}

export default function AudienceDetailsDialog({
  open,
  onOpenChange,
  audiences,
  outlineTitle
}: AudienceDetailsDialogProps) {
  const t = useTranslations('outlines');

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[80vh] flex flex-col" style={{ zIndex: 9999 }}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center text-lg">
            <Users size={20} className="mr-2 text-indigo-600" />
            {t('modal.view.suggestedAudiences')} ({audiences.length})
            {outlineTitle && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                - {outlineTitle}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full max-h-[calc(80vh-8rem)] overflow-y-auto">
            <div className="space-y-4 pr-4 pb-4">
              {audiences.map((oaLink, index) => (
                <div 
                  key={oaLink.audience.id} 
                  className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {/* 受众标题和类型 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                        {index + 1}. {oaLink.audience.name}
                      </h3>
                      {oaLink.audience.type && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {oaLink.audience.type}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 受众描述 */}
                  {oaLink.audience.description && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        描述:
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {oaLink.audience.description}
                      </p>
                    </div>
                  )}

                  {/* 受众标签 */}
                  {oaLink.audience.tags && oaLink.audience.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        标签:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {oaLink.audience.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs px-2 py-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 如果没有描述和标签，显示提示 */}
                  {!oaLink.audience.description && (!oaLink.audience.tags || oaLink.audience.tags.length === 0) && (
                    <p className="text-sm text-gray-500 italic">
                      暂无更多详细信息
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
} 