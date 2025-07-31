import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Link from '@tiptap/extension-link'
import CustomImage from './imageExtension'
import CalloutExtension from './calloutExtension'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Markdown } from 'tiptap-markdown'

/**
 * Tiptap扩展配置
 * 
 * 这里配置了富文本编辑器的所有功能扩展，包括：
 * - 基础功能（StarterKit）
 * - 文本样式（颜色、对齐等）
 * - 链接和自定义图片（支持占位符）
 * - 表格功能
 * - Markdown支持
 */

export const TiptapExtensions = [
  // 基础功能包：包含标题、粗体、斜体、列表等基础编辑功能
  StarterKit.configure({
    // 配置历史功能
    history: {
      depth: 50,
      newGroupDelay: 1000,
    },
    // 配置列表功能
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),

  // 文本样式扩展
  TextStyle,
  
  // 颜色扩展
  Color.configure({
    types: ['textStyle'],
  }),

  // 文本对齐
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
    defaultAlignment: 'left',
  }),

  // 排版功能：智能引号、省略号等
  Typography,

  // 链接功能
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'tiptap-link',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
  }),

  // 自定义图片功能 - 支持占位符和ImageControlData集成
  CustomImage.configure({
    inline: false,
    allowBase64: true,
    HTMLAttributes: {
      class: 'tiptap-image',
    },
  }),

  // GitHub 风格 Callout 功能
  CalloutExtension.configure({
    HTMLAttributes: {
      class: 'tiptap-callout',
    },
  }),

  // 表格功能
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'tiptap-table',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,

  // Markdown支持
  Markdown.configure({
    html: true,                  // 允许HTML输入/输出
    tightLists: true,            // 紧凑列表（li内无p标签）
    tightListClass: 'tight',     // 紧凑列表CSS类
    bulletListMarker: '-',       // 列表标记
    linkify: false,              // 不自动转换URL为链接
    breaks: false,               // 换行符不转换为<br>
    transformPastedText: true,   // 支持粘贴markdown文本
    transformCopiedText: true,   // 复制时转换为markdown
  }),
]

export default TiptapExtensions 