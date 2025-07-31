/**
 * HTML到Markdown转换工具
 * 
 * 用于将Tiptap的HTML内容转换为Markdown格式
 * 这对于与现有的Markdown存储格式兼容很重要
 */

import { Editor } from '@tiptap/core'
import TiptapExtensions from '../extensions'

/**
 * 将HTML内容转换为Markdown
 * @param html HTML字符串
 * @returns Markdown字符串
 */
export function htmlToMarkdown(html: string): string {
  try {
    // 创建一个临时编辑器实例用于转换
    const tempEditor = new Editor({
      extensions: TiptapExtensions,
      content: html,
      editable: false,
    })

    // 使用tiptap-markdown扩展的getMarkdown方法
    const markdown = tempEditor.storage.markdown.getMarkdown()
    
    // 销毁临时编辑器
    tempEditor.destroy()
    
    return markdown || ''
  } catch (error) {
    console.error('HTML to Markdown conversion error:', error)
    return ''
  }
}

/**
 * 批量转换HTML内容为Markdown
 * @param htmlContents HTML内容数组
 * @returns Markdown内容数组
 */
export function batchHtmlToMarkdown(htmlContents: string[]): string[] {
  return htmlContents.map(html => htmlToMarkdown(html))
}

/**
 * 验证HTML内容是否可以转换为Markdown
 * @param html HTML字符串
 * @returns 是否可以转换
 */
export function validateHtmlForMarkdown(html: string): boolean {
  try {
    const result = htmlToMarkdown(html)
    return result.length > 0
  } catch {
    return false
  }
}

export default htmlToMarkdown 