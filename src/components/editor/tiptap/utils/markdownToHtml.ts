/**
 * Markdown到HTML转换工具
 * 
 * 用于将现有的Markdown内容转换为Tiptap可编辑的HTML格式
 * 这是迁移现有内容的关键工具
 */

import { Editor } from '@tiptap/core'
import TiptapExtensions from '../extensions'

/**
 * 将Markdown内容转换为HTML
 * @param markdown Markdown字符串
 * @returns HTML字符串
 */
export function markdownToHtml(markdown: string): string {
  try {
    // 创建一个临时编辑器实例，直接设置markdown内容
    const tempEditor = new Editor({
      extensions: TiptapExtensions,
      content: markdown, // tiptap-markdown扩展会自动解析markdown
      editable: false,
    })

    // 获取HTML内容
    const html = tempEditor.getHTML()
    
    // 销毁临时编辑器
    tempEditor.destroy()
    
    return html || ''
  } catch (error) {
    console.error('Markdown to HTML conversion error:', error)
    // 如果转换失败，返回包装在段落中的原始内容
    return `<p>${markdown.replace(/\n/g, '<br>')}</p>`
  }
}

/**
 * 批量转换Markdown内容为HTML
 * @param markdownContents Markdown内容数组
 * @returns HTML内容数组
 */
export function batchMarkdownToHtml(markdownContents: string[]): string[] {
  return markdownContents.map(markdown => markdownToHtml(markdown))
}

/**
 * 验证Markdown内容是否可以转换为HTML
 * @param markdown Markdown字符串
 * @returns 是否可以转换
 */
export function validateMarkdownForHtml(markdown: string): boolean {
  try {
    const result = markdownToHtml(markdown)
    return result.length > 0
  } catch {
    return false
  }
}

/**
 * 安全的Markdown转HTML，包含错误处理
 * @param markdown Markdown字符串
 * @param fallback 转换失败时的fallback内容
 * @returns HTML字符串
 */
export function safeMarkdownToHtml(markdown: string, fallback: string = ''): string {
  try {
    return markdownToHtml(markdown)
  } catch (error) {
    console.warn('Markdown conversion failed, using fallback:', error)
    return fallback || `<p>${markdown}</p>`
  }
}

export default markdownToHtml 