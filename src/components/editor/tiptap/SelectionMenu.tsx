/**
 * Floating AI action menu when text is selected
 * 
 * Shows quick AI action buttons when user selects text
 */

import React, { useCallback, useEffect, useState } from 'react'
import { Editor } from '@tiptap/core'
import { BubbleMenu } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Wand2, 
  Languages, 
  Lightbulb, 
  Copy,
  Scissors,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import AIFloatingPanel from './AIFloatingPanel'

export interface SelectionMenuProps {
  editor: Editor | null
  onAIAction?: (action: string, selectedText?: string, customPrompt?: string) => void
}

/**
 * Selection text floating menu component
 */
export function SelectionMenu({ editor, onAIAction }: SelectionMenuProps) {
  const t = useTranslations('articles.editor.selectionMenu')
  
  const [selectedText, setSelectedText] = useState<string>('')
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false)
  const [aiPanelPosition, setAIPanelPosition] = useState<{ x: number; y: number } | undefined>()

  // Listen for selection changes
  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection
      const text = editor.state.doc.textBetween(from, to, ' ')
      setSelectedText(text)
    }

    editor.on('selectionUpdate', handleSelectionUpdate)
    
    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
    }
  }, [editor])

  const handleCopy = useCallback(() => {
    if (selectedText.trim()) {
      navigator.clipboard.writeText(selectedText)
    }
  }, [selectedText])

  const handleCut = useCallback(() => {
    if (selectedText.trim() && editor) {
      navigator.clipboard.writeText(selectedText)
      editor.chain().deleteSelection().run()
    }
  }, [selectedText, editor])

  // Handle AI button click
  const handleAIClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    // Get button position
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const position = {
      x: buttonRect.left,
      y: buttonRect.bottom + 8
    };
    setAIPanelPosition(position)
    
    setIsAIPanelOpen(true)
  }, [])

  // Handle AI panel execution
  const handleAIExecute = useCallback((action: string, customPrompt?: string) => {
    if (onAIAction) {
      if (customPrompt) {
        onAIAction(action, selectedText, customPrompt)
      } else {
        onAIAction(action, selectedText)
      }
    }
    setIsAIPanelOpen(false)
  }, [onAIAction, selectedText])

  // Close AI panel
  const handleAIPanelClose = useCallback(() => {
    setIsAIPanelOpen(false)
  }, [])

  if (!editor) {
    return null
  }

  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{ 
          duration: 100,
          placement: 'top',
          offset: [0, 10]
        }}
        className={cn(
          "flex items-center gap-1 p-2",
          "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600",
          "rounded-lg shadow-lg backdrop-blur-sm",
          "z-40"
        )}
        shouldShow={({ editor, view, state, oldState, from, to }) => {
          // Only show when text is selected
          const { selection } = state
          const { empty } = selection
          
          // Check if there's actual text selection
          if (empty) return false
          
          const text = editor.state.doc.textBetween(from, to, ' ')
          return text.trim().length > 0
        }}
      >
        {/* Basic editing operations */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
          title={t('copy')}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCut}
          className="h-8 w-8 p-0"
          title={t('cut')}
        >
          <Scissors className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        {/* AI action button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAIClick}
          className="h-8 px-2 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200/50"
          title={t('aiAssistant')}
        >
          <Zap className="h-4 w-4 mr-1 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">{t('aiPolish')}</span>
        </Button>
      </BubbleMenu>

      {/* AI floating panel */}
      <AIFloatingPanel
        isOpen={isAIPanelOpen}
        onClose={handleAIPanelClose}
        onExecute={handleAIExecute}
        selectedText={selectedText}
        position={aiPanelPosition}
        className="z-[100]"
      />
    </>
  )
}

export default SelectionMenu 