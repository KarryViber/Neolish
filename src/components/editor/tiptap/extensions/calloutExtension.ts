import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { textblockTypeInputRule } from '@tiptap/core'
import CalloutComponent from '../components/CalloutComponent'

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * 插入 callout 块
       */
      setCallout: (attributes?: { type?: string }) => ReturnType
      /**
       * 切换 callout 类型
       */
      toggleCallout: (attributes?: { type?: string }) => ReturnType
      /**
       * 取消 callout
       */
      unsetCallout: () => ReturnType
    }
  }
}

/**
 * GitHub 风格的 Callout 扩展（简化版）
 * 支持 NOTE, TIP, WARNING, IMPORTANT, CAUTION 等类型
 */
export const CalloutExtension = Node.create<CalloutOptions>({
  name: 'callout',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'note',
        parseHTML: element => {
          // 首先尝试从data-callout-type获取，然后从data-type获取
          return element.getAttribute('data-callout-type') || 
                 element.getAttribute('data-type') || 
                 'note'
        },
        renderHTML: attributes => {
          if (!attributes.type) {
            return {}
          }
          return {
            'data-type': attributes.type,
            'data-callout-type': attributes.type, // 同时设置两个属性确保兼容性
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      // 优先解析带有data-callout-type的div（由markdown转换生成）
      {
        tag: 'div[data-callout-type]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return false
          const element = dom as HTMLElement
          const type = element.getAttribute('data-callout-type') || 'note'
          // Debug logging only when needed
        if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_CALLOUT === 'true') {
          console.log(`[CalloutExtension] Parsing div with data-callout-type: ${type}`)
        }
          return { type }
        },
      },
      // 解析带有data-type="callout"的div
      {
        tag: 'div[data-type="callout"]',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return false
          const element = dom as HTMLElement
          const type = element.getAttribute('data-callout-type') || 
                      element.getAttribute('data-type') || 'note'
          if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_CALLOUT === 'true') {
          console.log(`[CalloutExtension] Parsing div with data-type="callout": ${type}`)
        }
          return { type }
        },
      },
      // 解析通用的callout class
      {
        tag: 'div.callout',
        getAttrs: (dom) => {
          if (typeof dom === 'string') return false
          const element = dom as HTMLElement
          
          // 优先从data属性获取类型
          let type = element.getAttribute('data-callout-type') || 
                    element.getAttribute('data-type')
          
          // 如果没有data属性，从class中提取类型
          if (!type) {
            const classes = element.className.split(' ')
            const typeClass = classes.find(cls => cls.startsWith('callout-'))
            type = typeClass ? typeClass.replace('callout-', '') : 'note'
          }
          
          if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_CALLOUT === 'true') {
          console.log(`[CalloutExtension] Parsing div.callout: ${type}`)
        }
          return { type }
        },
      },
      // 支持从 markdown 解析
      {
        tag: 'blockquote',
        priority: 100,
        getAttrs: (dom) => {
          if (typeof dom === 'string') return false
          const element = dom as HTMLElement
          
          // 获取元素的文本内容
          const textContent = element.textContent || ''
          
          // 匹配 [!TYPE] 语法
          const match = textContent.match(/^\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(.*)$/i)
          
          if (match) {
            const type = match[1].toLowerCase()
            
            // 清理内容：移除 [!TYPE] 部分，保留剩余内容
            const cleanedContent = textContent.replace(/^\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/, '').trim()
            
            // 更新元素内容
            if (cleanedContent) {
              element.innerHTML = `<p>${cleanedContent}</p>`
            } else {
              element.innerHTML = '<p></p>'
            }
            
            if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_CALLOUT === 'true') {
          console.log(`[CalloutExtension] Parsing blockquote with type: ${type}`)
        }
            return {
              type,
            }
          }
          
          return false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        {
          'data-type': 'callout',
          'data-callout-type': HTMLAttributes.type || 'note',
          class: `callout callout-${HTMLAttributes.type || 'note'}`,
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent, {
      as: 'div',
      contentDOMElementTag: 'div',
    })
  },

  addCommands() {
    return {
      setCallout:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.wrapIn(this.name, attributes)
        },
      toggleCallout:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, attributes)
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name)
        },
    }
  },

  addInputRules() {
    return [
      // 当用户输入 > [!TYPE] 时自动转换为 callout
      textblockTypeInputRule({
        find: /^>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(.*)$/,
        type: this.type,
        getAttributes: (match) => {
          const type = match[1].toLowerCase()
          return {
            type,
          }
        },
      }),
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => {
        if (this.editor.isActive('callout')) {
          return this.editor.commands.unsetCallout()
        } else {
          return this.editor.commands.setCallout({ type: 'note' })
        }
      },
    }
  },
})

export default CalloutExtension
