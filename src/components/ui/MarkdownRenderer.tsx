/**
 * Markdown 渲染组件
 * 
 * 用于在预览模式下渲染 Markdown 内容，支持基础格式化
 * 样式与 Tiptap 编辑器保持一致
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

/**
 * 简单的 Markdown 解析器，支持基础格式
 */
const parseMarkdown = (content: string): React.ReactNode => {
  if (!content) return null

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentListItems: React.ReactNode[] = []
  let isInOrderedList = false
  let isInUnorderedList = false

  const flushList = () => {
    if (currentListItems.length > 0) {
      if (isInOrderedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 mb-4 pl-4">
            {currentListItems}
          </ol>
        )
      } else if (isInUnorderedList) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 pl-4">
            {currentListItems}
          </ul>
        )
      }
      currentListItems = []
      isInOrderedList = false
      isInUnorderedList = false
    }
  }

  const parseInlineElements = (text: string): React.ReactNode => {
    // 处理内联格式：**bold**, *italic*, `code`, 特殊的图像建议格式
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\*\([^)]*\)\*)/)
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*(') && part.endsWith(')*')) {
        // 处理图像建议格式：*(Image suggestion: ...)*
        const suggestion = part.slice(2, -2)
        return (
          <span 
            key={index} 
            className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs border border-blue-200 dark:border-blue-800 italic"
          >
            💡 {suggestion}
          </span>
        )
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**') && !part.startsWith('*(')) {
        return <em key={index}>{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code 
            key={index} 
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
          >
            {part.slice(1, -1)}
          </code>
        )
      }
      return part
    })
  }

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    // 空行
    if (!trimmedLine) {
      flushList()
      if (elements.length > 0) {
        elements.push(<div key={`space-${index}`} className="h-2" />)
      }
      return
    }

    // 标题
    if (trimmedLine.startsWith('#')) {
      flushList()
      const level = trimmedLine.match(/^#+/)?.[0].length || 1
      const text = trimmedLine.replace(/^#+\s*/, '')
      
      const headingClasses = {
        1: 'text-lg font-bold mb-3 mt-4 text-gray-900 dark:text-gray-100',
        2: 'text-base font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200',
        3: 'text-sm font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200',
        4: 'text-sm font-semibold mb-1 mt-2 text-gray-700 dark:text-gray-300',
        5: 'text-xs font-semibold mb-1 mt-2 text-gray-700 dark:text-gray-300',
        6: 'text-xs font-semibold mb-1 mt-2 text-gray-600 dark:text-gray-400',
      }

      const HeadingTag = `h${Math.min(level, 6)}` as any
      
      elements.push(
        React.createElement(
          HeadingTag,
          {
            key: `heading-${index}`,
            className: headingClasses[Math.min(level, 6) as keyof typeof headingClasses]
          },
          parseInlineElements(text)
        )
      )
      return
    }

    // 无序列表项
    if (trimmedLine.match(/^[-*+]\s/)) {
      const text = trimmedLine.replace(/^[-*+]\s+/, '')
      
      if (!isInUnorderedList) {
        flushList()
        isInUnorderedList = true
      }
      
      currentListItems.push(
        <li key={`li-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
          {parseInlineElements(text)}
        </li>
      )
      return
    }

    // 有序列表项
    if (trimmedLine.match(/^\d+\.\s/)) {
      const text = trimmedLine.replace(/^\d+\.\s+/, '')
      
      if (!isInOrderedList) {
        flushList()
        isInOrderedList = true
      }
      
      currentListItems.push(
        <li key={`li-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
          {parseInlineElements(text)}
        </li>
      )
      return
    }

    // 引用
    if (trimmedLine.startsWith('>')) {
      flushList()
      const text = trimmedLine.replace(/^>\s*/, '')
      elements.push(
        <blockquote 
          key={`quote-${index}`} 
          className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 mb-4 italic text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
        >
          {parseInlineElements(text)}
        </blockquote>
      )
      return
    }

    // 代码块
    if (trimmedLine.startsWith('```')) {
      flushList()
      // 简单处理，不支持语法高亮
      elements.push(
        <pre 
          key={`code-${index}`} 
          className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-4 overflow-x-auto"
        >
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
            {trimmedLine.replace(/^```.*/, '')}
          </code>
        </pre>
      )
      return
    }

    // 普通段落
    if (!isInUnorderedList && !isInOrderedList) {
      elements.push(
        <p key={`p-${index}`} className="mb-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {parseInlineElements(trimmedLine)}
        </p>
      )
    }
  })

  // 处理最后的列表
  flushList()

  return elements
}

/**
 * Markdown 渲染器组件
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className 
}) => {
  const parsedContent = parseMarkdown(content)
  
  return (
    <div className={cn(
      "w-full h-full text-sm",
      className
    )}>
      {parsedContent}
    </div>
  )
}

export default MarkdownRenderer 