/**
 * Tiptap图片集成Hook
 * 
 * 集成现有的ImageControlData逻辑到Tiptap编辑器
 * 提供图片占位符插入、URL更新等功能
 */

import { useCallback } from 'react'
import { Editor } from '@tiptap/core'

export interface ImageControlData {
  placeholderTag: string;
  type: 'ai-generated' | 'uploaded';
  prompt?: string;
  uploadedFile?: File;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  imageUrl?: string;
  errorMessage?: string;
  jobId?: string;
  isPlaceholderPresent?: boolean; // 标记占位符是否存在于当前内容中
}

export interface TiptapImageIntegration {
  insertImagePlaceholder: (placeholder: string, type: 'ai-generated' | 'uploaded') => boolean
  updateImageUrl: (placeholder: string, url: string) => boolean
  insertMarkdownImageAtCursor: (placeholder: string, url: string, alt?: string) => boolean
  extractImagePlaceholdersFromContent: (content: string) => string[]
  syncImageControlsWithContent: (content: string, imageControls: ImageControlData[]) => ImageControlData[]
}

/**
 * Tiptap图片集成Hook
 * @param editor Tiptap编辑器实例
 * @returns 图片集成方法
 */
export function useTiptapImageIntegration(editor: Editor | null): TiptapImageIntegration {

  // 插入图片占位符
  const insertImagePlaceholder = useCallback((placeholder: string, type: 'ai-generated' | 'uploaded'): boolean => {
    if (!editor) return false
    
    try {
      // 使用自定义命令（需要确保命令已正确注册）
      return (editor.commands as any).insertImagePlaceholder({ placeholder, type })
    } catch (error) {
      console.error('Failed to insert image placeholder:', error)
      // 降级方案：插入普通图片占位符
      const placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03IDdIMTdWMTdIN1Y3WiIgc3Ryb2tlPSIjOUI5OUE0IiBzdHJva2Utd2lkdGg9IjIiLz4KPGV5ZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzlCOTlBNCIvPgo8L3N2Zz4K'
      return editor.chain().focus().setImage({ 
        src: placeholderSrc, 
        alt: `${placeholder} placeholder` 
      }).run()
    }
  }, [editor])

  // 更新图片URL
  const updateImageUrl = useCallback((placeholder: string, url: string): boolean => {
    if (!editor) return false
    
    try {
      // 使用自定义命令
      return (editor.commands as any).setImageUrl({ placeholder, url })
    } catch (error) {
      console.error('Failed to update image URL:', error)
      // 降级方案：手动查找并更新
      const { state, view } = editor
      const { tr } = state
      let updated = false

      state.doc.descendants((node, pos) => {
        if (node.type.name === 'customImage' && node.attrs['data-placeholder'] === placeholder) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            src: url,
            class: 'tiptap-image',
          })
          updated = true
          return false
        }
      })

      if (updated) {
        view.dispatch(tr)
        return true
      }
      return false
    }
  }, [editor])

  // 在光标位置插入Markdown图片
  const insertMarkdownImageAtCursor = useCallback((placeholder: string, url: string, alt?: string): boolean => {
    if (!editor) return false
    
    try {
      const markdownImage = `![${alt || placeholder}](${url})`
      return editor.chain().focus().insertContent(markdownImage).run()
    } catch (error) {
      console.error('Failed to insert markdown image:', error)
      return false
    }
  }, [editor])

  // 从内容中提取图片占位符
  const extractImagePlaceholdersFromContent = useCallback((content: string): string[] => {
    const placeholders: string[] = []
    
    // 从HTML内容中提取data-placeholder属性
    const placeholderRegex = /data-placeholder="([^"]+)"/g
    let match
    while ((match = placeholderRegex.exec(content)) !== null) {
      placeholders.push(match[1])
    }
    
    // 从Markdown内容中提取占位符标记（如{{image1}}）
    const markdownPlaceholderRegex = /\{\{(image\d+)\}\}/g
    while ((match = markdownPlaceholderRegex.exec(content)) !== null) {
      if (!placeholders.includes(match[1])) {
        placeholders.push(match[1])
      }
    }
    
    return placeholders
  }, [])

  // 同步ImageControls与内容
  const syncImageControlsWithContent = useCallback((content: string, imageControls: ImageControlData[]): ImageControlData[] => {
    const contentPlaceholders = extractImagePlaceholdersFromContent(content)
    
    // 移除不再存在于内容中的控件
    const syncedControls = imageControls.filter(control => 
      contentPlaceholders.includes(control.placeholderTag)
    )
    
    // 为新的占位符创建控件
    contentPlaceholders.forEach(placeholder => {
      const existingControl = syncedControls.find(control => 
        control.placeholderTag === placeholder
      )
      
      if (!existingControl) {
        syncedControls.push({
          placeholderTag: placeholder,
          type: 'ai-generated', // 默认类型，可以后续修改
          status: 'idle',
        })
      }
    })
    
    return syncedControls
  }, [extractImagePlaceholdersFromContent])

  return {
    insertImagePlaceholder,
    updateImageUrl,
    insertMarkdownImageAtCursor,
    extractImagePlaceholdersFromContent,
    syncImageControlsWithContent,
  }
}

export default useTiptapImageIntegration 