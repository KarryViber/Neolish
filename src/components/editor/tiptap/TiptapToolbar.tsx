/**
 * Tiptap Toolbar Component
 * 
 * Provides common rich text editing function buttons
 * Including text formatting, headings, lists, links and other features
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Editor } from '@tiptap/core'
import { 
  Bold, 
  Italic, 
  Underline,
  Strikethrough,
  Code,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Sparkles,
  Wand2,
  Languages,
  Lightbulb,
  FileText,
  Zap,
  MessageSquare,
  Info,
  AlertTriangle,
  AlertCircle,
  Ban
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import AIFloatingPanel from './AIFloatingPanel'
import InputDialog from '@/components/ui/input-dialog'
import { useTranslations } from 'next-intl'

interface TiptapToolbarProps {
  editor: Editor | null
  className?: string
  onAIAction?: (action: string, selectedText?: string, customPrompt?: string) => void
}

/**
 * Toolbar button component
 */
interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={(e) => {
        e.preventDefault() // Prevent default behavior
        onClick()
      }}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
      onMouseDown={(e) => e.preventDefault()} // Prevent button from gaining focus
    >
      {children}
    </Button>
  )
}

/**
 * Simple separator component
 */
function ToolbarSeparator() {
  return <div className="h-6 w-px bg-border mx-1" />
}

/**
 * Tiptap Toolbar Component
 */
export function TiptapToolbar({ editor, className, onAIAction }: TiptapToolbarProps) {
  const t = useTranslations('articles.editor.toolbar')
  
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [aiPanelPosition, setAIPanelPosition] = useState<{ x: number; y: number } | undefined>()
  const [selectedTextForAI, setSelectedTextForAI] = useState<string>('')
  
  // 辅助函数：执行命令时保持滚动位置
  const executeWithScrollPreservation = useCallback((commandFn: () => void) => {
    if (!editor) return;
    
    // 获取编辑器容器和当前滚动位置
    const editorElement = editor.view.dom;
    const scrollContainer = editorElement.closest('[style*="overflow"]') || 
                           editorElement.closest('.overflow-auto') ||
                           editorElement.parentElement;
    
    const currentScrollTop = scrollContainer?.scrollTop || 0;
    const currentScrollLeft = scrollContainer?.scrollLeft || 0;
    
    // 保存当前选择状态
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    
    // 执行命令
    commandFn();
    
    // 恢复滚动位置的策略
    const restoreScroll = () => {
      if (scrollContainer) {
        // 强制恢复到原始滚动位置
        scrollContainer.scrollTop = currentScrollTop;
        scrollContainer.scrollLeft = currentScrollLeft;
        
        // 防止再次自动滚动
        if (hasSelection) {
          // 对于选择文字的情况，添加额外的保护
          setTimeout(() => {
            scrollContainer.scrollTop = currentScrollTop;
            scrollContainer.scrollLeft = currentScrollLeft;
          }, 10);
        }
      }
    };
    
    // 使用双重保险：立即恢复 + 延迟恢复
    requestAnimationFrame(restoreScroll);
    
    // 额外的保护机制：监听短期内的滚动事件并阻止
    if (hasSelection) {
      const preventAutoScroll = (e: Event) => {
        if (scrollContainer && (
          scrollContainer.scrollTop !== currentScrollTop || 
          scrollContainer.scrollLeft !== currentScrollLeft
        )) {
          e.preventDefault();
          scrollContainer.scrollTop = currentScrollTop;
          scrollContainer.scrollLeft = currentScrollLeft;
        }
      };
      
      scrollContainer?.addEventListener('scroll', preventAutoScroll, { passive: false });
      
      const scrollTimeoutId = setTimeout(() => {
        scrollContainer?.removeEventListener('scroll', preventAutoScroll);
      }, 100); // 100ms的保护期
      
      return () => {
        clearTimeout(scrollTimeoutId);
        scrollContainer?.removeEventListener('scroll', preventAutoScroll);
      };
    }
  }, [editor]);

  // Enhanced state management for better accuracy
  const [editorStates, setEditorStates] = useState({
    // Text formatting states
    isBold: false,
    isItalic: false,
    isStrike: false,
    isCode: false,
    
    // Heading states
    isParagraph: false,
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
    
    // List states
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    
    // Alignment states
    isAlignLeft: false,
    isAlignCenter: false,
    isAlignRight: false,
    
    // Other states
    isCallout: false,
    isLink: false,
    
    // Capabilities
    canUndo: false,
    canRedo: false,
  })
  
  // Dialog state management
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  // Precise list state detection helper functions
  const checkBulletListActive = useCallback(() => {
    if (!editor) return false
    
    // First check if in bulletList
    if (editor.isActive('bulletList')) return true
    
    // If in listItem, check if parent node is bulletList
    if (editor.isActive('listItem')) {
      const { state } = editor
      const { $from } = state.selection
      
      // Search up for parent nodes to find list type
      for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth)
        if (node.type.name === 'bulletList') return true
        if (node.type.name === 'orderedList') return false
      }
    }
    
    return false
  }, [editor])

  const checkOrderedListActive = useCallback(() => {
    if (!editor) return false
    
    // First check if in orderedList
    if (editor.isActive('orderedList')) return true
    
    // If in listItem, check if parent node is orderedList
    if (editor.isActive('listItem')) {
      const { state } = editor
      const { $from } = state.selection
      
      // Search up for parent nodes to find list type
      for (let depth = $from.depth; depth > 0; depth--) {
        const node = $from.node(depth)
        if (node.type.name === 'orderedList') return true
        if (node.type.name === 'bulletList') return false
      }
    }
    
    return false
  }, [editor])

  // Enhanced state update function with debugging
  const updateEditorStates = useCallback(() => {
    if (!editor) return

    const newStates = {
      // Text formatting states
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isStrike: editor.isActive('strike'),
      isCode: editor.isActive('code'),
      
      // Heading states - more precise detection
      isParagraph: editor.isActive('paragraph'),
      isHeading1: editor.isActive('heading', { level: 1 }),
      isHeading2: editor.isActive('heading', { level: 2 }),
      isHeading3: editor.isActive('heading', { level: 3 }),
      
      // List states
      isBulletList: checkBulletListActive(),
      isOrderedList: checkOrderedListActive(),
      isBlockquote: editor.isActive('blockquote'),
      
      // Alignment states
      isAlignLeft: editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })),
      isAlignCenter: editor.isActive({ textAlign: 'center' }),
      isAlignRight: editor.isActive({ textAlign: 'right' }),
      
      // Other states
      isCallout: editor.isActive('callout'),
      isLink: editor.isActive('link'),
      
      // Capabilities
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }

    // Debug logging for heading states - only in development
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_TOOLBAR === 'true') {
      const { from, to } = editor.state.selection
      const selectedNode = editor.state.doc.nodeAt(from)
      console.log('[Toolbar State Update]', {
        selection: { from, to },
        selectedNode: selectedNode?.type.name,
        headingStates: {
          isParagraph: newStates.isParagraph,
          isHeading1: newStates.isHeading1,
          isHeading2: newStates.isHeading2,
          isHeading3: newStates.isHeading3,
        },
        isActiveHeading1: editor.isActive('heading', { level: 1 }),
        isActiveHeading2: editor.isActive('heading', { level: 2 }),
        isActiveHeading3: editor.isActive('heading', { level: 3 }),
      })
    }

    setEditorStates(newStates)
  }, [editor, checkBulletListActive, checkOrderedListActive])

  // Handle AI button click
  const handleAIButtonClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    
    if (!editor) {
      return;
    }
    
    // Get selected text
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, ' ')
    setSelectedTextForAI(selectedText)
    
    // Set panel position (below AI button)
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const position = {
      x: buttonRect.left,
      y: buttonRect.bottom + 8
    };
    setAIPanelPosition(position)
    
    setIsAIPanelOpen(true)
  }, [editor])

  // Handle AI panel execution
  const handleAIExecute = useCallback((action: string, customPrompt?: string) => {
    if (onAIAction) {
      if (customPrompt) {
        // Custom prompt case
        onAIAction(action, selectedTextForAI, customPrompt)
      } else {
        // Preset operation case
        onAIAction(action, selectedTextForAI)
      }
    }
    setIsAIPanelOpen(false)
  }, [onAIAction, selectedTextForAI])

  // Close AI panel
  const handleAIPanelClose = useCallback(() => {
    setIsAIPanelOpen(false)
  }, [])

  // Handle link confirmation
  const handleLinkConfirm = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  // Handle image confirmation
  const handleImageConfirm = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  // Enhanced state monitoring with multiple event listeners
  useEffect(() => {
    if (!editor) return

    // Initial state update
    updateEditorStates()

    // Listen for all relevant events with proper typing
    editor.on('transaction', updateEditorStates)
    editor.on('selectionUpdate', updateEditorStates)
    editor.on('focus', updateEditorStates)
    editor.on('blur', updateEditorStates)
    editor.on('update', updateEditorStates)
    
    return () => {
      editor.off('transaction', updateEditorStates)
      editor.off('selectionUpdate', updateEditorStates)
      editor.off('focus', updateEditorStates)
      editor.off('blur', updateEditorStates)
      editor.off('update', updateEditorStates)
    }
  }, [editor, updateEditorStates])

  if (!editor) {
    return null
  }

  const addLink = () => {
    setLinkDialogOpen(true)
  }

  const addImage = () => {
    setImageDialogOpen(true)
  }

  // Enhanced heading dropdown with better state detection
  const getHeadingText = () => {
    if (editorStates.isHeading1) return t('heading1')
    if (editorStates.isHeading2) return t('heading2')
    if (editorStates.isHeading3) return t('heading3')
    if (editorStates.isParagraph) return t('paragraph')
    return t('format')
  }

  return (
    <>
      <div className={`flex items-center gap-1 p-3 bg-white border-b border-gray-200 shadow-sm ${className || ''}`}>
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().undo().run())}
            disabled={!editorStates.canUndo}
            title={t('undo')}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().redo().run())}
            disabled={!editorStates.canRedo}
            title={t('redo')}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Enhanced Heading selection with current state display */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 min-w-[100px] justify-start"
              onMouseDown={(e) => e.preventDefault()}
            >
              <Type className="h-4 w-4 mr-2" />
              <span className="text-sm">{getHeadingText()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editorStates.isParagraph ? 'bg-accent' : ''}
            >
              {t('paragraph')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editorStates.isHeading1 ? 'bg-accent' : ''}
            >
              <Heading1 className="h-4 w-4 mr-2" />
              {t('heading1')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editorStates.isHeading2 ? 'bg-accent' : ''}
            >
              <Heading2 className="h-4 w-4 mr-2" />
              {t('heading2')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editorStates.isHeading3 ? 'bg-accent' : ''}
            >
              <Heading3 className="h-4 w-4 mr-2" />
              {t('heading3')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarSeparator />

        {/* Text formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().toggleBold().run())}
            isActive={editorStates.isBold}
            title={t('bold')}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().toggleItalic().run())}
            isActive={editorStates.isItalic}
            title={t('italic')}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().toggleStrike().run())}
            isActive={editorStates.isStrike}
            title={t('strikethrough')}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().toggleCode().run())}
            isActive={editorStates.isCode}
            title={t('code')}
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editorStates.isAlignLeft}
            title={t('alignLeft')}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editorStates.isAlignCenter}
            title={t('alignCenter')}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editorStates.isAlignRight}
            title={t('alignRight')}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* Lists and quotes */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().toggleBulletList().run())}
            isActive={editorStates.isBulletList}
            title={t('bulletList')}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => executeWithScrollPreservation(() => editor.chain().focus().toggleOrderedList().run())}
            isActive={editorStates.isOrderedList}
            title={t('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editorStates.isBlockquote}
            title={t('quote')}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          
          {/* Callout dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={editorStates.isCallout ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                title={t('insertCallout')}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  transition: 'background-color 0.15s ease, color 0.15s ease'
                }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => executeWithScrollPreservation(() => {
                  if (editorStates.isCallout) {
                    editor.chain().focus().unsetCallout().run()
                  } else {
                    // 获取当前选择的位置
                    const { from, to } = editor.state.selection;
                    
                    // 如果没有选择内容，在当前光标位置插入
                    if (from === to) {
                      // 插入新的callout块，但不强制focus
                      editor.chain().setCallout({ type: 'note' }).run()
                    } else {
                      // 如果有选择的内容，包装它
                      editor.chain().focus().setCallout({ type: 'note' }).run()
                    }
                  }
                })}
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4 text-blue-600" />
                <span>{t('note')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeWithScrollPreservation(() => {
                  const { from, to } = editor.state.selection;
                  
                  if (from === to) {
                    editor.chain().setCallout({ type: 'tip' }).run()
                  } else {
                    editor.chain().focus().setCallout({ type: 'tip' }).run()
                  }
                })}
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4 text-green-600" />
                <span>{t('tip')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeWithScrollPreservation(() => {
                  const { from, to } = editor.state.selection;
                  
                  if (from === to) {
                    editor.chain().setCallout({ type: 'warning' }).run()
                  } else {
                    editor.chain().focus().setCallout({ type: 'warning' }).run()
                  }
                })}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span>{t('warning')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeWithScrollPreservation(() => {
                  const { from, to } = editor.state.selection;
                  
                  if (from === to) {
                    editor.chain().setCallout({ type: 'important' }).run()
                  } else {
                    editor.chain().focus().setCallout({ type: 'important' }).run()
                  }
                })}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-purple-600" />
                <span>{t('important')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => executeWithScrollPreservation(() => {
                  const { from, to } = editor.state.selection;
                  
                  if (from === to) {
                    editor.chain().setCallout({ type: 'caution' }).run()
                  } else {
                    editor.chain().focus().setCallout({ type: 'caution' }).run()
                  }
                })}
                className="flex items-center gap-2"
              >
                <Ban className="h-4 w-4 text-red-600" />
                <span>{t('caution')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => executeWithScrollPreservation(() => {
                  if (editorStates.isCallout) {
                    editor.chain().focus().unsetCallout().run()
                  }
                })}
                className="flex items-center gap-2 text-gray-600"
                disabled={!editorStates.isCallout}
              >
                <span>{t('removeCallout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ToolbarSeparator />

        {/* Links and images */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={addLink}
            isActive={editorStates.isLink}
            title={t('insertLink')}
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={addImage}
            title={t('insertImage')}
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <ToolbarSeparator />

        {/* AI enhancement features - unified AI button */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIButtonClick}
            className="h-8 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200/50"
            title={t('aiAssistant')}
          >
            <Zap className="h-4 w-4 mr-1 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">{t('aiPolish')}</span>
          </Button>
        </div>
      </div>

      {/* AI floating panel */}
      <AIFloatingPanel
        isOpen={isAIPanelOpen}
        onClose={handleAIPanelClose}
        onExecute={handleAIExecute}
        selectedText={selectedTextForAI}
        position={aiPanelPosition}
      />

      {/* Link input dialog */}
      <InputDialog
        isOpen={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onConfirm={handleLinkConfirm}
        title={t('insertLinkDialog.title')}
        description={t('insertLinkDialog.description')}
        placeholder={t('insertLinkDialog.placeholder')}
        type="url"
        variant="link"
      />

      {/* Image input dialog */}
      <InputDialog
        isOpen={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onConfirm={handleImageConfirm}
        title={t('insertImageDialog.title')}
        description={t('insertImageDialog.description')}
        placeholder={t('insertImageDialog.placeholder')}
        type="url"
        variant="image"
      />
    </>
  )
}

export default TiptapToolbar 