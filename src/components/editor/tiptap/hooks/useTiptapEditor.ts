/**
 * Tiptap编辑器Hook
 * 
 * 管理Tiptap编辑器实例、内容状态和核心功能
 * 提供与现有MDEditor API兼容的接口
 */

import { useEditor, Editor } from '@tiptap/react'
import { useCallback, useEffect, useMemo } from 'react'
import TiptapExtensions from '../extensions'
import { useContentConverter } from './useContentConverter'
import { preprocessMarkdownForTiptap } from '../utils/markdownTransform'

export interface TiptapEditorOptions {
  initialContent?: string
  placeholder?: string
  editable?: boolean
  onUpdate?: (html: string, markdown?: string) => void
  onSelectionUpdate?: (editor: Editor) => void
  className?: string
  autoFocus?: boolean
}

export interface TiptapEditorReturn {
  editor: Editor | null
  isReady: boolean
  isEmpty: boolean
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
}

/**
 * Tiptap编辑器Hook
 * @param options 编辑器配置选项
 * @returns 编辑器实例和操作方法
 */
export function useTiptapEditor(options: TiptapEditorOptions = {}): TiptapEditorReturn {
  const {
    initialContent = '',
    placeholder = '开始编写...',
    editable = true,
    onUpdate,
    onSelectionUpdate,
    autoFocus = false,
  } = options

  const { convertHtmlToMarkdown, convertMarkdownToHtml } = useContentConverter()

  const editor = useEditor({
    extensions: TiptapExtensions,
    content: initialContent,
    editable,
    autofocus: autoFocus,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor prose prose-gray dark:prose-invert max-w-none focus:outline-none',
        'data-placeholder': placeholder,
      },
      scrollThreshold: 0,
      scrollMargin: 0,
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const html = editor.getHTML()
        const markdown = convertHtmlToMarkdown(html)
        onUpdate(html, markdown)
      }
    },
    onSelectionUpdate: ({ editor }) => {
      if (onSelectionUpdate) {
        onSelectionUpdate(editor)
      }
    },
    onCreate: ({ editor }) => {
      editor.view.dom.style.scrollBehavior = 'smooth'
      
      setTimeout(() => {
        const callouts = editor.view.dom.querySelectorAll('.callout')
        callouts.forEach((callout) => {
          if (!callout.getAttribute('data-type')) {
            callout.setAttribute('data-type', 'callout')
          }
        })
      }, 0)
    },
  })

  // 编辑器状态
  const isReady = useMemo(() => !!editor, [editor])
  const isEmpty = useMemo(() => {
    if (!editor) return true
    return editor.isEmpty
  }, [editor?.state.doc])

  // 获取HTML内容
  const getHTML = useCallback((): string => {
    if (!editor) return ''
    return editor.getHTML()
  }, [editor])

  // 获取Markdown内容
  const getMarkdown = useCallback((): string => {
    if (!editor) return ''
    try {
      return editor.storage.markdown.getMarkdown() || ''
    } catch (error) {
      console.error('Error getting markdown:', error)
      return convertHtmlToMarkdown(editor.getHTML())
    }
  }, [editor, convertHtmlToMarkdown])

  // 设置内容（HTML格式）
  const setContent = useCallback((content: string) => {
    if (!editor) return
    
    // 使用 queueMicrotask 来确保在当前渲染完成后再执行
    queueMicrotask(() => {
      try {
        // 保存当前光标位置
        const currentSelection = editor.state.selection
        const { from, to } = currentSelection
        
        // 设置新内容
        editor.commands.setContent(content)
        
        // 尝试恢复光标位置（如果位置仍然有效）
        const newDocSize = editor.state.doc.content.size
        if (from <= newDocSize && to <= newDocSize) {
          editor.commands.setTextSelection({ from, to })
        } else {
          // 如果原位置无效，将光标设置到文档末尾
          editor.commands.focus('end')
        }
        
        // 手动触发onUpdate回调以确保状态同步
        if (onUpdate) {
          if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_EDITOR === 'true') {
            console.log('[TiptapEditor] setContent: Manually triggering onUpdate')
          }
          const html = editor.getHTML()
          const markdown = convertHtmlToMarkdown(html)
          onUpdate(html, markdown)
        }
      } catch (error) {
        console.error('Error setting content:', error)
      }
    })
  }, [editor, onUpdate, convertHtmlToMarkdown])

  // 设置Markdown内容
  const setMarkdownContent = useCallback((markdown: string) => {
    if (!editor) return
    
    // 使用 queueMicrotask 来确保在当前渲染完成后再执行
    queueMicrotask(() => {
      try {
        // 预处理 markdown，转换 callout 语法
        const processedMarkdown = preprocessMarkdownForTiptap(markdown)
        
        // tiptap-markdown扩展支持直接设置markdown内容
        editor.commands.setContent(processedMarkdown)
        
        // 手动触发onUpdate回调以确保状态同步
        if (onUpdate) {
          if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_EDITOR === 'true') {
            console.log('[TiptapEditor] setMarkdownContent: Manually triggering onUpdate')
          }
          const html = editor.getHTML()
          const markdown = convertHtmlToMarkdown(html)
          onUpdate(html, markdown)
        }
      } catch (error) {
        console.error('Error setting markdown content:', error)
        // 如果直接设置失败，先转换为HTML再设置
        try {
          const processedMarkdown = preprocessMarkdownForTiptap(markdown)
          const html = convertMarkdownToHtml(processedMarkdown)
          editor.commands.setContent(html)
          
          // 对于fallback情况也要触发onUpdate
          if (onUpdate) {
            if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_EDITOR === 'true') {
              console.log('[TiptapEditor] setMarkdownContent (fallback): Manually triggering onUpdate')
            }
            const finalHtml = editor.getHTML()
            const finalMarkdown = convertHtmlToMarkdown(finalHtml)
            onUpdate(finalHtml, finalMarkdown)
          }
        } catch (fallbackError) {
          console.error('Error with fallback content setting:', fallbackError)
        }
      }
    })
  }, [editor, convertMarkdownToHtml, onUpdate, convertHtmlToMarkdown])

  // 获取选中的文本
  const getSelectedText = useCallback((): string => {
    if (!editor) return ''
    const { from, to } = editor.state.selection
    return editor.state.doc.textBetween(from, to, ' ')
  }, [editor])

  // 插入内容
  const insertContent = useCallback((content: string) => {
    if (!editor) return
    
    console.log(`[TiptapEditor] Inserting content: ${content.substring(0, 100)}...`)
    
    try {
      // 使用事务来确保内容插入的原子性
      editor.commands.insertContent(content)
      
      // 确保DOM更新
      editor.view.updateState(editor.state)
      
      console.log(`[TiptapEditor] Content inserted successfully`)
    } catch (error) {
      console.error(`[TiptapEditor] Error inserting content:`, error)
      throw error
    }
  }, [editor])

  // 替换内容中的特定文本
  const replaceText = useCallback((searchText: string, replaceWith: string): boolean => {
    if (!editor) return false
    
    console.log(`[TiptapEditor] Replacing "${searchText}" with "${replaceWith.substring(0, 50)}..."`)
    
    try {
      const currentHTML = editor.getHTML()
      const currentMarkdown = getMarkdown()
      
      // 尝试在HTML中查找和替换
      if (currentHTML.includes(searchText)) {
        const updatedHTML = currentHTML.replace(searchText, replaceWith)
        console.log(`[TiptapEditor] Replacing in HTML content`)
        
        // 使用事务来确保原子性操作
        editor.commands.setContent(updatedHTML)
        
        // 强制DOM更新和重新渲染
        editor.view.updateState(editor.state)
        
        console.log(`[TiptapEditor] Text replaced in HTML content successfully`)
        return true
      }
      
      // 尝试在Markdown中查找和替换
      if (currentMarkdown.includes(searchText)) {
        const updatedMarkdown = currentMarkdown.replace(searchText, replaceWith)
        console.log(`[TiptapEditor] Replacing in Markdown content`)
        
        // 对于markdown替换，需要检查replaceWith是否是HTML
        if (replaceWith.includes('<') && replaceWith.includes('>')) {
          // 如果替换内容是HTML，直接设置HTML内容
          const updatedHTML = currentHTML.replace(searchText, replaceWith)
          editor.commands.setContent(updatedHTML)
        } else {
          // 如果是纯文本，设置为markdown
          setMarkdownContent(updatedMarkdown)
        }
        
        // 强制重新渲染
        editor.view.updateState(editor.state)
        
        console.log(`[TiptapEditor] Text replaced in Markdown content successfully`)
        return true
      }
      
      console.warn(`[TiptapEditor] Search text "${searchText}" not found in content`)
      return false
      
    } catch (error) {
      console.error(`[TiptapEditor] Error replacing text:`, error)
      return false
    }
  }, [editor, getMarkdown, setMarkdownContent])

  // 检查内容中是否包含特定文本
  const containsText = useCallback((searchText: string): boolean => {
    if (!editor) return false
    
    const currentHTML = editor.getHTML()
    const currentMarkdown = getMarkdown()
    
    return currentHTML.includes(searchText) || currentMarkdown.includes(searchText)
  }, [editor, getMarkdown])

  // 聚焦编辑器
  const focus = useCallback(() => {
    if (!editor) return
    editor.commands.focus()
  }, [editor])

  // 失焦编辑器
  const blur = useCallback(() => {
    if (!editor) return
    editor.commands.blur()
  }, [editor])

  // 清空内容
  const clearContent = useCallback(() => {
    if (!editor) return
    editor.commands.clearContent()
  }, [editor])

  return {
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
  }
}

export default useTiptapEditor 