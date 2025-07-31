/**
 * 内容转换Hook
 * 
 * 提供HTML和Markdown之间的双向转换功能
 * 用于Tiptap编辑器的内容格式转换
 */

import { useCallback } from 'react'
import { htmlToMarkdown } from '../utils/htmlToMarkdown'
import { markdownToHtml, safeMarkdownToHtml } from '../utils/markdownToHtml'

export interface ContentConverter {
  convertHtmlToMarkdown: (html: string) => string
  convertMarkdownToHtml: (markdown: string) => string
  safeConvertMarkdownToHtml: (markdown: string, fallback?: string) => string
  batchConvertHtmlToMarkdown: (htmlArray: string[]) => string[]
  batchConvertMarkdownToHtml: (markdownArray: string[]) => string[]
}

/**
 * 内容转换Hook
 * @returns 转换函数集合
 */
export function useContentConverter(): ContentConverter {
  
  const convertHtmlToMarkdown = useCallback((html: string): string => {
    return htmlToMarkdown(html)
  }, [])

  const convertMarkdownToHtml = useCallback((markdown: string): string => {
    return markdownToHtml(markdown)
  }, [])

  const safeConvertMarkdownToHtml = useCallback((markdown: string, fallback: string = ''): string => {
    return safeMarkdownToHtml(markdown, fallback)
  }, [])

  const batchConvertHtmlToMarkdown = useCallback((htmlArray: string[]): string[] => {
    return htmlArray.map(html => htmlToMarkdown(html))
  }, [])

  const batchConvertMarkdownToHtml = useCallback((markdownArray: string[]): string[] => {
    return markdownArray.map(markdown => markdownToHtml(markdown))
  }, [])

  return {
    convertHtmlToMarkdown,
    convertMarkdownToHtml,
    safeConvertMarkdownToHtml,
    batchConvertHtmlToMarkdown,
    batchConvertMarkdownToHtml,
  }
}

export default useContentConverter 