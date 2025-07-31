/**
 * Markdown 编辑器组件
 * 
 * 提供 Markdown 编辑和预览功能，样式与 Tiptap 编辑器保持一致
 */

import React, { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import MarkdownRenderer from './MarkdownRenderer'
import { Eye, Edit, Bold, Italic, Code, List, ListOrdered, Quote, Heading1, Heading2, Heading3 } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: string | number
  disabled?: boolean
  showToolbar?: boolean
  hidePreviewToggle?: boolean
  initialPreviewMode?: boolean
}

/**
 * Markdown 编辑器组件
 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '开始编写...',
  className,
  height = '400px',
  disabled = false,
  showToolbar = true,
  hidePreviewToggle = false,
  initialPreviewMode = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(initialPreviewMode)
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  // 响应外部 initialPreviewMode 的变化
  useEffect(() => {
    setIsPreviewMode(initialPreviewMode)
  }, [initialPreviewMode])

  // 插入 Markdown 格式文本
  const insertMarkdown = useCallback((before: string, after: string = '', placeholder: string = '') => {
    if (!textareaRef || disabled) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = value.substring(start, end)
    const replacement = selectedText || placeholder
    const newText = value.substring(0, start) + before + replacement + after + value.substring(end)
    
    onChange(newText)
    
    // 设置光标位置
    setTimeout(() => {
      if (textareaRef) {
        const newCursorPos = start + before.length + replacement.length
        textareaRef.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.focus()
      }
    }, 0)
  }, [value, onChange, textareaRef, disabled])

  // 插入列表项
  const insertList = useCallback((ordered: boolean = false) => {
    if (!textareaRef || disabled) return

    const start = textareaRef.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const lineEnd = value.indexOf('\n', start)
    const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd)
    
    const prefix = ordered ? '1. ' : '- '
    const newLine = '\n' + prefix + '新列表项'
    
    if (currentLine.trim() === '') {
      // 当前行为空，直接插入列表项
      const newText = value.substring(0, lineStart) + prefix + '新列表项' + value.substring(lineStart)
      onChange(newText)
      setTimeout(() => {
        if (textareaRef) {
          const newPos = lineStart + prefix.length + 4 // 4 = '新列表项'.length
          textareaRef.setSelectionRange(newPos, newPos)
          textareaRef.focus()
        }
      }, 0)
    } else {
      // 在当前行后添加新列表项
      const insertPos = lineEnd === -1 ? value.length : lineEnd
      const newText = value.substring(0, insertPos) + newLine + value.substring(insertPos)
      onChange(newText)
      setTimeout(() => {
        if (textareaRef) {
          const newPos = insertPos + newLine.length
          textareaRef.setSelectionRange(newPos, newPos)
          textareaRef.focus()
        }
      }, 0)
    }
  }, [value, onChange, textareaRef, disabled])

  // 工具栏按钮配置
  const toolbarButtons = [
    {
      icon: Bold,
      title: '加粗',
      action: () => insertMarkdown('**', '**', '加粗文本')
    },
    {
      icon: Italic,
      title: '斜体',
      action: () => insertMarkdown('*', '*', '斜体文本')
    },
    {
      icon: Code,
      title: '代码',
      action: () => insertMarkdown('`', '`', '代码')
    },
    { type: 'separator' },
    {
      icon: Heading1,
      title: '一级标题',
      action: () => insertMarkdown('# ', '', '一级标题')
    },
    {
      icon: Heading2,
      title: '二级标题',
      action: () => insertMarkdown('## ', '', '二级标题')
    },
    {
      icon: Heading3,
      title: '三级标题',
      action: () => insertMarkdown('### ', '', '三级标题')
    },
    { type: 'separator' },
    {
      icon: List,
      title: '无序列表',
      action: () => insertList(false)
    },
    {
      icon: ListOrdered,
      title: '有序列表',
      action: () => insertList(true)
    },
    {
      icon: Quote,
      title: '引用',
      action: () => insertMarkdown('> ', '', '引用文本')
    }
  ]

  const contentHeight = typeof height === 'number' ? `${height}px` : height
  const toolbarHeight = showToolbar ? '52px' : '0px'
  const editorHeight = `calc(${contentHeight} - ${toolbarHeight})`

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => {
              if (button.type === 'separator') {
                return <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
              }
              
              const IconComponent = button.icon!
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    button.action?.()
                  }}
                  disabled={disabled || isPreviewMode}
                  title={button.title}
                  className="h-8 w-8 p-0"
                >
                  <IconComponent size={16} />
                </Button>
              )
            })}
          </div>
          
          {/* 预览切换按钮 */}
          {!hidePreviewToggle && (
            <div className="flex gap-1">
              <Button
                variant={isPreviewMode ? "outline" : "default"}
                size="sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsPreviewMode(false)
                }}
                disabled={disabled}
                className="h-8 px-3"
              >
                <Edit size={14} className="mr-1" />
                编辑
              </Button>
              <Button
                variant={isPreviewMode ? "default" : "outline"}
                size="sm"
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsPreviewMode(true)
                }}
                disabled={disabled}
                className="h-8 px-3"
              >
                <Eye size={14} className="mr-1" />
                预览
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
      <div style={{ height: editorHeight }}>
        {isPreviewMode ? (
          <div className="h-full px-3 py-2 overflow-y-auto bg-transparent">
            <MarkdownRenderer content={value || '暂无内容'} />
          </div>
        ) : (
          <Textarea
            ref={setTextareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="h-full border-0 rounded-none resize-none focus-visible:ring-0 font-mono text-sm"
            style={{ minHeight: editorHeight }}
          />
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor 