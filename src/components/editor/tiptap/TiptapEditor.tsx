/**
 * Tiptap编辑器主组件
 * 
 * 提供完整的富文本编辑体验，整合工具栏和编辑器
 * 兼容现有的MDEditor API接口
 */

import React, { useCallback, useImperativeHandle, forwardRef, startTransition } from 'react'
import { EditorContent } from '@tiptap/react'
import { cn } from '@/lib/utils'
import { useTiptapEditor, TiptapEditorOptions } from './hooks/useTiptapEditor'
import TiptapToolbar from './TiptapToolbar'
import SelectionMenu from './SelectionMenu'

export interface TiptapEditorProps extends Omit<TiptapEditorOptions, 'onUpdate'> {
  value?: string
  onChange?: (html: string, markdown?: string) => void
  showToolbar?: boolean
  toolbarClassName?: string
  editorClassName?: string
  height?: string | number
  placeholder?: string
  onAIAction?: (action: string, selectedText?: string, customPrompt?: string) => void
}

export interface TiptapEditorRef {
  getHTML: () => string
  getMarkdown: () => string
  setContent: (content: string) => void
  setMarkdownContent: (markdown: string) => void
  getSelectedText: () => string
  insertContent: (content: string) => void
  replaceText: (searchText: string, replaceWith: string) => boolean
  containsText: (searchText: string) => boolean
  focus: () => void
  blur: () => void
  clearContent: () => void
  editor: any // Tiptap Editor实例
}

/**
 * Tiptap编辑器组件
 */
const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(({
  value = '',
  onChange,
  showToolbar = true,
  toolbarClassName,
  editorClassName,
  className,
  height = '400px',
  placeholder = '开始编写...',
  editable = true,
  autoFocus = false,
  onAIAction,
  ...options
}, ref) => {

  // 处理内容更新
  const handleUpdate = useCallback((html: string, markdown?: string) => {
    if (onChange) {
      onChange(html, markdown)
    }
  }, [onChange])

  // 使用Tiptap编辑器hook
  const {
    editor,
    isReady,
    isEmpty,
    getHTML,
    getMarkdown,
    setContent,
    setMarkdownContent,
    getSelectedText,
    insertContent,
    replaceText,
    containsText,
    focus,
    blur,
    clearContent,
  } = useTiptapEditor({
    initialContent: value,
    placeholder,
    editable,
    onUpdate: handleUpdate,
    autoFocus,
    ...options,
  })

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getHTML,
    getMarkdown,
    setContent,
    setMarkdownContent,
    getSelectedText,
    insertContent,
    replaceText,
    containsText,
    focus,
    blur,
    clearContent,
    editor,
  }), [
    getHTML,
    getMarkdown,
    setContent,
    setMarkdownContent,
    getSelectedText,
    insertContent,
    replaceText,
    containsText,
    focus,
    blur,
    clearContent,
    editor,
  ])

  // 当value属性变化时，更新编辑器内容
  React.useEffect(() => {
    if (editor && value !== undefined && value !== getHTML()) {
      // 检查编辑器是否处于活动状态（用户正在编辑）
      const isEditorFocused = editor.isFocused
      const hasSelection = !editor.state.selection.empty
      
      // 如果编辑器正在被用户使用，避免重置内容
      if (isEditorFocused || hasSelection) {
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_EDITOR === 'true') {
          console.log('[TiptapEditor] Skipping content update - editor is actively being used')
        }
        return
      }
      
      // 使用 startTransition 来避免在渲染过程中调用 flushSync
      startTransition(() => {
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_EDITOR === 'true') {
          console.log('[TiptapEditor] Updating content from value prop')
        }
        setContent(value)
      })
    }
  }, [value, editor, setContent, getHTML])

  if (!isReady) {
    return (
      <div className={cn("border rounded-lg", className)}>
        {showToolbar && (
          <div className="p-2 border-b bg-muted/50">
            <div className="h-8 bg-muted animate-pulse rounded" />
          </div>
        )}
        <div 
          className="p-4"
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
        >
          <div className="h-4 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded mb-2 w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
      </div>
    )
  }

  // 计算编辑器内容区域的高度，为工具栏预留空间
  const toolbarHeight = showToolbar ? 52 : 0; // 工具栏大约52px高度
  const contentHeight = typeof height === 'number' 
    ? `${height - toolbarHeight}px` 
    : `calc(${height} - ${toolbarHeight}px)`;

  return (
    <div className={cn("border rounded-lg overflow-hidden flex flex-col", className)}>
      {/* 粘性工具栏 */}
      {showToolbar && (
        <div className="sticky top-0 z-10 bg-white border-b">
          <TiptapToolbar 
            editor={editor} 
            className={toolbarClassName}
            onAIAction={onAIAction}
          />
        </div>
      )}
      
      {/* 编辑器内容区域 */}
      <div 
        className={cn(
          "relative flex-1 min-h-0",
          editorClassName
        )}
        style={{ 
          height: showToolbar ? contentHeight : (typeof height === 'number' ? `${height}px` : height)
        }}
      >
        <EditorContent 
          editor={editor}
          className="h-full w-full"
        />
        
        {/* 选择文本时的浮动菜单 */}
        <SelectionMenu 
          editor={editor}
          onAIAction={onAIAction}
        />
        
        {/* 空状态占位符 */}
        {isEmpty && (
          <div className="absolute inset-0 p-4 pointer-events-none">
            <p className="text-muted-foreground text-sm">
              {placeholder}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})

TiptapEditor.displayName = 'TiptapEditor'

export { TiptapEditor }
export default TiptapEditor 