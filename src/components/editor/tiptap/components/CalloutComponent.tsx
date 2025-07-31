import React, { startTransition } from 'react'
import { NodeViewContent, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useTranslations } from 'next-intl'
import { 
  Info, 
  Lightbulb, 
  AlertTriangle, 
  AlertCircle, 
  Ban 
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Callout 类型配置函数，接受翻译函数
const createCalloutTypes = (t: (key: string) => string) => ({
  note: {
    icon: Info,
    label: t('note'),
    className: 'callout-note',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800'
  },
  tip: {
    icon: Lightbulb,
    label: t('tip'),
    className: 'callout-tip',
    borderColor: 'border-l-green-500',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800'
  },
  warning: {
    icon: AlertTriangle,
    label: t('warning'),
    className: 'callout-warning',
    borderColor: 'border-l-yellow-500',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800'
  },
  important: {
    icon: AlertCircle,
    label: t('important'),
    className: 'callout-important',
    borderColor: 'border-l-purple-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    titleColor: 'text-purple-800'
  },
  caution: {
    icon: Ban,
    label: t('caution'),
    className: 'callout-caution',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800'
  }
})

// 类型数组，用于循环切换
const TYPE_ORDER = ['note', 'tip', 'warning', 'important', 'caution'] as const

/**
 * GitHub 风格的 Callout 组件（简化版）
 */
export default function CalloutComponent({ node, updateAttributes, deleteNode, editor }: NodeViewProps) {
  const t = useTranslations('articles.editor.callouts')
  const type = node.attrs.type || 'note'
  const CALLOUT_TYPES = createCalloutTypes(t)
  const config = CALLOUT_TYPES[type as keyof typeof CALLOUT_TYPES] || CALLOUT_TYPES.note
  const Icon = config.icon

  // 点击图标切换到下一个类型
  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const currentIndex = TYPE_ORDER.indexOf(type as any)
    const nextIndex = (currentIndex + 1) % TYPE_ORDER.length
    const nextType = TYPE_ORDER[nextIndex]
    
    // 使用 startTransition 来避免 flushSync 错误
    startTransition(() => {
      updateAttributes({ type: nextType })
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // 按下 Backspace 删除空的 callout（当内容为空时）
    if (event.key === 'Backspace') {
      // 这里可以添加删除逻辑，但通常由编辑器自动处理
    }
  }

  return (
    <NodeViewWrapper className="callout-wrapper">
      <div 
        className={cn(
          "callout border-l-4 p-4 my-4 rounded-r-lg",
          config.className,
          config.borderColor,
          config.bgColor
        )}
      >
        {/* Callout 头部 - 可点击的图标和类型标签 */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={handleIconClick}
            className={cn(
              "flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0",
              "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded"
            )}
            title={t('cycleTooltip', { type: config.label })}
          >
            <Icon className={cn("h-5 w-5", config.iconColor)} />
            <span className={cn(
              "font-semibold text-sm uppercase tracking-wide",
              config.titleColor
            )}>
              {config.label}
            </span>
          </button>
        </div>

        {/* Callout 内容 */}
        <div className="callout-content">
          <NodeViewContent className="max-w-none" onKeyDown={handleKeyDown} />
        </div>
      </div>
    </NodeViewWrapper>
  )
} 