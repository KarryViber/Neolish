/**
 * 自定义图片扩展
 * 
 * 扩展基础的Image扩展，支持占位符、现有的ImageControlData逻辑和点击放大功能
 */

import Image from '@tiptap/extension-image'
import { mergeAttributes, type ChainedCommands } from '@tiptap/core'

/**
 * 图片点击放大处理函数
 */
function handleImageClick(event: Event) {
  const img = event.target as HTMLImageElement;
  if (!img || img.tagName !== 'IMG') return;
  
  // 创建放大的模态框
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
  `;
  
  const enlargedImg = document.createElement('img');
  enlargedImg.src = img.src;
  enlargedImg.alt = img.alt || '';
  enlargedImg.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  `;
  
  modal.appendChild(enlargedImg);
  document.body.appendChild(modal);
  
  // 创建ESC键处理器的引用，便于后续移除
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  
  // 安全移除模态框的函数
  const safeRemoveModal = () => {
    try {
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      // 移除ESC键监听器
      if (keydownHandler) {
        document.removeEventListener('keydown', keydownHandler);
        keydownHandler = null;
      }
    } catch (error) {
      console.warn('Modal already removed or not found:', error);
    }
  };
  
  // 点击模态框关闭
  modal.addEventListener('click', safeRemoveModal);
  
  // ESC键关闭
  keydownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      safeRemoveModal();
    }
  };
  document.addEventListener('keydown', keydownHandler);
}

/**
 * 自定义图片扩展，支持占位符、拖拽上传和点击放大
 */
export const CustomImage = Image.extend({
  name: 'customImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      'data-placeholder': {
        default: null,
        parseHTML: element => element.getAttribute('data-placeholder'),
        renderHTML: attributes => {
          if (!attributes['data-placeholder']) {
            return {}
          }
          return {
            'data-placeholder': attributes['data-placeholder'],
          }
        },
      },
      'data-type': {
        default: null,
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes['data-type']) {
            return {}
          }
          return {
            'data-type': attributes['data-type'],
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element) => {
          const img = element as HTMLElement
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            'data-placeholder': img.getAttribute('data-placeholder'),
            'data-type': img.getAttribute('data-type'),
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const img = document.createElement('img');
      Object.assign(img, HTMLAttributes);
      Object.entries(node.attrs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          img.setAttribute(key, value);
        }
      });
      
      // 创建绑定的事件处理器，便于后续移除
      const boundImageClickHandler = (event: Event) => handleImageClick(event);
      
      // 添加点击放大功能
      img.addEventListener('click', boundImageClickHandler);
      
      return {
        dom: img,
        destroy: () => {
          try {
            img.removeEventListener('click', boundImageClickHandler);
          } catch (error) {
            console.warn('Failed to remove image click listener:', error);
          }
        }
      };
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      insertImagePlaceholder: (options: { placeholder: string; type: 'ai-generated' | 'uploaded' }) => ({ commands }: { commands: ChainedCommands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: {
            src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03IDdIMTdWMTdIN1Y3WiIgc3Ryb2tlPSIjOUI5OUE0IiBzdHJva2Utd2lkdGg9IjIiLz4KPGV5ZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzlCOTlBNCIvPgo8L3N2Zz4K',
            alt: `${options.placeholder} placeholder`,
            'data-placeholder': options.placeholder,
            'data-type': options.type,
            class: 'tiptap-image-placeholder',
          },
        })
      },
      setImageUrl: (options: { placeholder: string; url: string }) => ({ commands }: { commands: ChainedCommands }) => {
        const { state } = this.editor
        const { doc } = state
        let found = false

        doc.descendants((node, pos) => {
          if (found) return false
          
          if (node.type.name === this.name && node.attrs['data-placeholder'] === options.placeholder) {
            commands.updateAttributes(this.name, {
              src: options.url,
              class: 'tiptap-image',
            })
            found = true
            return false
          }
        })

        return found
      },
    }
  },
})

export default CustomImage 