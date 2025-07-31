/**
 * AI Floating Panel Component
 * 
 * AIEditor-style AI operation panel
 * Provides custom input and preset operation options
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Sparkles, 
  Wand2, 
  Languages, 
  Lightbulb, 
  FileText, 
  ArrowRight,
  X,
  Edit3,
  Zap,
  Scissors,
  FileSpreadsheet,
  ChevronDown,
  Scale,
  GripVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'

export interface AIFloatingPanelProps {
  isOpen: boolean
  onClose: () => void
  onExecute: (action: string, customPrompt?: string) => void
  selectedText?: string
  position?: { x: number; y: number }
  className?: string
}

interface AIAction {
  id: string
  label: string
  icon: React.ReactNode
  prompt: string
  color: string
}

interface Language {
  code: string
  name: string
  nativeName: string
}

interface LengthAction {
  id: string
  label: string
  icon: React.ReactNode
  prompt: string
}

export function AIFloatingPanel({ 
  isOpen, 
  onClose, 
  onExecute, 
  selectedText,
  position,
  className 
}: AIFloatingPanelProps) {
  const t = useTranslations('articles.editor.aiFloatingPanel')
  
  // AI actions with translations
  const AI_ACTIONS: AIAction[] = useMemo(() => [
    {
      id: 'improve',
      label: t('actions.improve'),
      icon: <Sparkles className="h-4 w-4" />,
      prompt: 'Improve the writing quality to make it clearer and more persuasive',
      color: 'text-purple-600 hover:bg-purple-50'
    },
    {
      id: 'grammar',
      label: t('actions.grammar'),
      icon: <Edit3 className="h-4 w-4" />,
      prompt: 'Check and correct spelling and grammar errors',
      color: 'text-blue-600 hover:bg-blue-50'
    },
    {
      id: 'summarize',
      label: t('actions.summarize'),
      icon: <FileText className="h-4 w-4" />,
      prompt: 'Summarize the main points',
      color: 'text-teal-600 hover:bg-teal-50'
    }
  ], [t])

  const LENGTH_ACTIONS: LengthAction[] = [
    {
      id: 'shorter',
      label: t('actions.shorter'),
      icon: <Scissors className="h-4 w-4" />,
      prompt: 'Shorten the content while keeping the core information intact'
    },
    {
      id: 'longer',
      label: t('actions.longer'),
      icon: <FileSpreadsheet className="h-4 w-4" />,
      prompt: 'Expand the content with more details and explanations'
    }
  ]

  const LANGUAGES: Language[] = [
    { code: 'en', name: t('translate.languages.en'), nativeName: 'English' },
    { code: 'zh', name: t('translate.languages.zh'), nativeName: '中文' },
    { code: 'ja', name: t('translate.languages.ja'), nativeName: '日本語' },
    { code: 'fr', name: t('translate.languages.fr'), nativeName: 'Français' },
    { code: 'de', name: t('translate.languages.de'), nativeName: 'Deutsch' },
    { code: 'pt', name: t('translate.languages.pt'), nativeName: 'Português' },
    { code: 'es', name: t('translate.languages.es'), nativeName: 'Español' },
    { code: 'ko', name: t('translate.languages.ko'), nativeName: '한국어' },
    { code: 'ru', name: t('translate.languages.ru'), nativeName: 'Русский' },
    { code: 'it', name: t('translate.languages.it'), nativeName: 'Italiano' },
    { code: 'ar', name: t('translate.languages.ar'), nativeName: 'العربية' },
    { code: 'th', name: t('translate.languages.th'), nativeName: 'ไทย' }
  ]
  
  const [customPrompt, setCustomPrompt] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  
  // Drag-related state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panelPosition, setPanelPosition] = useState(position || { x: 0, y: 0 })

  // Smart positioning function - calculate optimal display position
  const calculateOptimalPosition = useCallback((initialPos: { x: number; y: number }) => {
    // Panel estimated dimensions (cannot get exact dimensions before actual rendering)
    const estimatedWidth = 320 // w-80 = 320px
    const estimatedHeight = 450 // Estimated height, including all content
    const margin = 16 // Margin
    const buttonClearance = 48 // Minimum clearance from trigger button
    
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    let optimalX = initialPos.x
    let optimalY = initialPos.y

    // Detect if overlapping with AI Polish button area (toolbar buttons are usually 40-48px high)
    const buttonArea = {
      left: initialPos.x - 50, // Button left boundary estimate
      right: initialPos.x + 50, // Button right boundary estimate  
      top: initialPos.y - 30, // Button top boundary estimate
      bottom: initialPos.y + 20 // Button bottom boundary estimate
    }

    // Check if would overlap with button area
    const wouldOverlapButton = (x: number, y: number) => {
      return !(x > buttonArea.right || 
               x + estimatedWidth < buttonArea.left ||
               y > buttonArea.bottom ||
               y + estimatedHeight < buttonArea.top)
    }

    // Candidate position list (sorted by priority)
    const candidatePositions = [
      // 1. Original position (if no overlap)
      { x: initialPos.x, y: initialPos.y, priority: 1, label: 'original' },
      // 2. Below button, maintain sufficient clearance
      { x: initialPos.x, y: buttonArea.bottom + buttonClearance, priority: 2, label: 'below' },
      // 3. Above button
      { x: initialPos.x, y: buttonArea.top - estimatedHeight - buttonClearance, priority: 3, label: 'above' },
      // 4. Right of button
      { x: buttonArea.right + buttonClearance, y: initialPos.y, priority: 4, label: 'right' },
      // 5. Left of button
      { x: buttonArea.left - estimatedWidth - buttonClearance, y: initialPos.y, priority: 5, label: 'left' },
      // 6. Bottom-right corner avoidance
      { x: buttonArea.right + 20, y: buttonArea.bottom + 20, priority: 6, label: 'corner' }
    ]

    // Evaluate candidate positions, select best available position
    let bestPosition = candidatePositions[0] // Default to original position
    
    for (const candidate of candidatePositions) {
      // Check if within viewport bounds
      const inBounds = 
        candidate.x >= margin && 
        candidate.x + estimatedWidth + margin <= viewportWidth &&
        candidate.y >= margin && 
        candidate.y + estimatedHeight + margin <= viewportHeight

      // Check if no overlap with button
      const noOverlap = !wouldOverlapButton(candidate.x, candidate.y)

      if (inBounds && noOverlap) {
        bestPosition = candidate
        break // Found first available highest priority position
      }
    }

    optimalX = bestPosition.x
    optimalY = bestPosition.y

    // Development mode display positioning strategy (only displayed in console)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Smart Positioning] Strategy: ${bestPosition.label}, Position: (${optimalX}, ${optimalY})`)
    }

    // If selected position still needs boundary adjustment, perform fine adjustment
    if (optimalX + estimatedWidth + margin > viewportWidth) {
      optimalX = viewportWidth - estimatedWidth - margin
    }
    if (optimalX < margin) {
      optimalX = margin
    }
    if (optimalY + estimatedHeight + margin > viewportHeight) {
      optimalY = viewportHeight - estimatedHeight - margin
    }
    if (optimalY < margin) {
      optimalY = margin
    }
    
    return { x: optimalX, y: optimalY }
  }, [])

  // When the input position changes, update internal position state and perform smart positioning
  useEffect(() => {
    if (position && isOpen) {
      const result = calculateOptimalPosition(position)
      setPanelPosition({ x: result.x, y: result.y })
    }
  }, [position, isOpen, calculateOptimalPosition])

  // Debug close event
  const handleClose = useCallback((reason?: string) => {
    onClose();
  }, [onClose]);

  // Drag start
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    // Only start dragging when clicking the header area
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input')) {
      return // Not start dragging on button or input field
    }

    setIsDragging(true)
    setDragStart({
      x: e.clientX - panelPosition.x,
      y: e.clientY - panelPosition.y
    })
    e.preventDefault()
  }, [panelPosition])

  // Dragging process
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !panelRef.current) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // Get actual panel dimensions
    const panelRect = panelRef.current.getBoundingClientRect()
    const panelWidth = panelRect.width
    const panelHeight = panelRect.height
    
    // Ensure panel does not exceed viewport boundaries, leaving some margin
    const margin = 10
    const maxX = window.innerWidth - panelWidth - margin
    const maxY = window.innerHeight - panelHeight - margin

    const boundedX = Math.max(margin, Math.min(newX, maxX))
    const boundedY = Math.max(margin, Math.min(newY, maxY))

    setPanelPosition({
      x: boundedX,
      y: boundedY
    })
  }, [isDragging, dragStart])

  // Drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Listen for drag events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // When panel is opened, focus input field
  useEffect(() => {
    if (isOpen && isCustomMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isCustomMode])

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose('escape-key')
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleClose])

  const handleActionClick = useCallback((action: AIAction) => {
    onExecute(action.id, action.prompt)
    handleClose('preset-execute')
  }, [onExecute, handleClose])

  const handleTranslateClick = useCallback((language: Language) => {
    const prompt = `Translate to ${language.nativeName}(${language.name})`
    onExecute('translate', prompt)
    handleClose('translate-execute')
  }, [onExecute, handleClose])

  const handleLengthClick = useCallback((lengthAction: LengthAction) => {
    onExecute(lengthAction.id, lengthAction.prompt)
    handleClose('length-execute')
  }, [onExecute, handleClose])

  const handleCustomExecute = useCallback(() => {
    if (customPrompt.trim()) {
      onExecute('custom', customPrompt.trim())
      setCustomPrompt('')
      setIsCustomMode(false)
      handleClose('custom-execute')
    }
  }, [customPrompt, onExecute, handleClose])



  const handleCustomModeToggle = useCallback(() => {
    setIsCustomMode(prev => {
      const newMode = !prev
      if (newMode) {
        // Switch to custom mode, pre-fill a prompt
        setCustomPrompt('Please help me improve this content:')
        setTimeout(() => inputRef.current?.focus(), 100)
      } else {
        setCustomPrompt('')
      }
      return newMode
    })
  }, [])

  const handlePresetAction = useCallback((action: string) => {
    const actionObj = AI_ACTIONS.find(a => a.id === action);
    if (actionObj) {
      handleActionClick(actionObj);
    }
  }, [handleActionClick, AI_ACTIONS])

  // Click outside to close panel
  useEffect(() => {
    if (isOpen) {
      // Delay adding listener, to avoid button click event immediately triggering close
      const timer = setTimeout(() => {
        
        const handleClickOutsideDelayed = (event: MouseEvent) => {
          
          const target = event.target as Node;
          
          // Check if clicked on panel interior
          if (panelRef.current && panelRef.current.contains(target)) {
            return;
          }
          
          // Check if clicked on DropdownMenu's Portal content
          const clickedElement = target as Element;
          if (clickedElement.closest) {
            // Check Radix UI pop-up layer
            if (clickedElement.closest('[data-radix-popper-content-wrapper]') ||
                clickedElement.closest('[data-radix-dropdown-menu-content]') ||
                clickedElement.closest('[data-radix-dropdown-menu-item]') ||
                clickedElement.closest('[data-radix-portal]') ||
                clickedElement.closest('[role="menu"]') ||
                clickedElement.closest('[role="menuitem"]')) {
              return;
            }
          }
          
          handleClose('click-outside');
        };
        
        document.addEventListener('mousedown', handleClickOutsideDelayed)
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutsideDelayed)
        }
      }, 300)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const panelStyle = position 
    ? { position: 'fixed' as const, left: panelPosition.x, top: panelPosition.y }
    : {}

  return (
    <div 
      ref={panelRef}
      className={cn(
        "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600",
        "rounded-xl shadow-lg backdrop-blur-sm z-[100]",
        "w-80 p-4",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        isDragging && "shadow-2xl ring-2 ring-blue-200 dark:ring-blue-800",
        "transition-all duration-300 ease-out",
        className
      )}
      style={panelStyle}
    >
      {/* Header */}
      <div 
        className={cn(
          "flex items-center justify-between mb-3 px-2 py-1 -mx-2 -mt-1 rounded-t-xl",
          "transition-colors duration-200",
          isDragging 
            ? "bg-blue-100 dark:bg-blue-900/30 cursor-grabbing" 
            : "cursor-grab hover:bg-gray-50 dark:hover:bg-slate-700/50"
        )}
        onMouseDown={handleDragStart}
        title={t('dragToMove')}
      >
        <div className="flex items-center gap-2">
          <GripVertical className={cn(
            "h-4 w-4 flex-shrink-0 transition-colors",
            isDragging ? "text-blue-500" : "text-gray-400"
          )} />
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100 select-none">
            {t('title')}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 flex-shrink-0"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Custom input area */}
      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={t('customMode.placeholder')}
            className="flex-1 text-sm"
            disabled={isDragging}
            onKeyDown={(e) => {
              // 完全禁用回车键发送，避免与日文输入法冲突
              if (e.key === 'Enter') {
                console.log('AI Panel: Enter key blocked for IME compatibility')
                e.preventDefault() // 阻止默认行为
                e.stopPropagation() // 阻止事件冒泡
                return false // 明确阻止事件
              }
            }}
          />
          <Button
            onClick={handleCustomExecute}
            disabled={!customPrompt.trim() || isDragging}
            size="sm"
            className="px-3"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        {selectedText && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            {t('customMode.switchTo')}
          </p>
        )}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100 dark:border-slate-700 my-4" />

      {/* Preset operation list */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('actionsPrompt')}
        </p>
        
        {AI_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => handlePresetAction(action.id)}
            disabled={isDragging}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-lg text-left",
              "hover:bg-gray-50 dark:hover:bg-slate-700",
              "transition-colors duration-150",
              "text-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isDragging && "pointer-events-none"
            )}
          >
            <span className={action.color}>
              {action.icon}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {action.label}
            </span>
          </button>
        ))}

        {/* Independent length adjustment feature */}
        <DropdownMenu open={isDragging ? false : undefined}>
          <DropdownMenuTrigger asChild>
            <button
              disabled={isDragging}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg text-left",
                "hover:bg-gray-50 dark:hover:bg-slate-700",
                "transition-colors duration-150",
                "text-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isDragging && "pointer-events-none"
              )}
            >
              <span className="text-green-600 hover:bg-green-50">
                <Scale className="h-4 w-4" />
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {t('length.title')}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-48 z-[110]"
            sideOffset={5}
          >
            {LENGTH_ACTIONS.map((lengthAction) => (
              <DropdownMenuItem
                key={lengthAction.id}
                onSelect={() => {
                  handleLengthClick(lengthAction);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {lengthAction.icon}
                  <span>{lengthAction.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Independent translation feature */}
        <DropdownMenu open={isDragging ? false : undefined}>
          <DropdownMenuTrigger asChild>
            <button
              disabled={isDragging}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg text-left",
                "hover:bg-gray-50 dark:hover:bg-slate-700",
                "transition-colors duration-150",
                "text-sm",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isDragging && "pointer-events-none"
              )}
            >
              <span className="text-indigo-600 hover:bg-indigo-50">
                <Languages className="h-4 w-4" />
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {t('translate.title')}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-48 z-[110] max-h-64 overflow-y-auto"
            sideOffset={5}
          >
            {LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onSelect={() => {
                  handleTranslateClick(language);
                }}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-xs text-gray-500">{language.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Prompt information */}
      {selectedText && (
        <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {t('selectedTextPrompt')}
          </p>
        </div>
      )}
    </div>
  )
}

export default AIFloatingPanel 