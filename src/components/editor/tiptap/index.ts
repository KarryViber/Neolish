/**
 * Tiptap编辑器模块入口
 * 
 * 导出所有Tiptap相关的组件、hooks和工具函数
 */

// 主要组件
export { default as TiptapEditor } from './TiptapEditor'
export type { TiptapEditorProps, TiptapEditorRef } from './TiptapEditor'

export { default as TiptapToolbar } from './TiptapToolbar'

export { default as SelectionMenu } from './SelectionMenu'
export type { SelectionMenuProps } from './SelectionMenu'

export { default as AIFloatingPanel } from './AIFloatingPanel'
export type { AIFloatingPanelProps } from './AIFloatingPanel'

// Hooks
export { default as useTiptapEditor } from './hooks/useTiptapEditor'
export type { TiptapEditorOptions, TiptapEditorReturn } from './hooks/useTiptapEditor'

export { default as useContentConverter } from './hooks/useContentConverter'
export type { ContentConverter } from './hooks/useContentConverter'

export { default as useTiptapImageIntegration } from './hooks/useTiptapImageIntegration'
export type { 
  TiptapImageIntegration, 
  ImageControlData
} from './hooks/useTiptapImageIntegration'

// 扩展配置
export { default as TiptapExtensions } from './extensions'

// 工具函数
export { default as htmlToMarkdown } from './utils/htmlToMarkdown'
export { batchHtmlToMarkdown, validateHtmlForMarkdown } from './utils/htmlToMarkdown'

export { default as markdownToHtml } from './utils/markdownToHtml'
export { 
  batchMarkdownToHtml, 
  validateMarkdownForHtml, 
  safeMarkdownToHtml 
} from './utils/markdownToHtml' 