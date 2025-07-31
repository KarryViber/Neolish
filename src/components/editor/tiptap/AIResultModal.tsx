/**
 * AI Result Preview Modal Component
 * 
 * Displays before/after content comparison from AI processing and provides user confirmation actions
 * Supports secondary conversation interaction for iterative optimization
 */

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Copy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Send,
  User,
  Bot,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

// 处理文本中的转义字符
const processEscapeCharacters = (text: string): string => {
  return text
    .replace(/\\n/g, '\n')     // 换行符
    .replace(/\\t/g, '\t')     // 制表符  
    .replace(/\\r/g, '\r')     // 回车符
    .replace(/\\\\/g, '\\')    // 反斜杠
}

export interface AIResultModalProps {
  isOpen: boolean
  onClose: () => void
  originalText: string
  aiSuggestedText: string
  actionType: string
  actionLabel: string
  onAccept: (finalText: string) => void
  onReject: () => void
  onContinueChat?: (message: string, currentText: string) => Promise<string>
  isLoading?: boolean
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  improve: <Sparkles className="h-4 w-4" />,
  grammar: <Edit3 className="h-4 w-4" />,
  shorter: <ArrowRight className="h-4 w-4" />,
  longer: <ArrowRight className="h-4 w-4" />,
  summarize: <Copy className="h-4 w-4" />,
  translate: <RotateCcw className="h-4 w-4" />,
  custom: <Sparkles className="h-4 w-4" />
}

const ACTION_COLORS: Record<string, string> = {
  improve: 'bg-purple-100 text-purple-700',
  grammar: 'bg-blue-100 text-blue-700',
  shorter: 'bg-green-100 text-green-700',
  longer: 'bg-orange-100 text-orange-700',
  summarize: 'bg-teal-100 text-teal-700',
  translate: 'bg-indigo-100 text-indigo-700',
  custom: 'bg-gray-100 text-gray-700'
}

export function AIResultModal({
  isOpen,
  onClose,
  originalText,
  aiSuggestedText,
  actionType,
  actionLabel,
  onAccept,
  onReject,
  onContinueChat,
  isLoading = false
}: AIResultModalProps) {
  const t = useTranslations('articles.editor.aiResultModal')
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(aiSuggestedText)
  
  // 聊天相关状态
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [currentIterationText, setCurrentIterationText] = useState(aiSuggestedText)
  
  const chatInputRef = useRef<HTMLInputElement>(null)

  // 重置编辑状态
  const resetEditingState = useCallback(() => {
    setIsEditing(false)
    setEditedText(aiSuggestedText)
    setShowChat(false)
    setChatMessages([])
    setChatInput('')
    setCurrentIterationText(aiSuggestedText)
  }, [aiSuggestedText])

  // 当Modal打开时重置状态
  useEffect(() => {
    if (isOpen) {
      resetEditingState()
    }
  }, [isOpen, resetEditingState])

  // 自动滚动聊天到底部
  useEffect(() => {
    if (showChat && chatMessages.length > 0) {
      // 使用setTimeout确保DOM更新完成后再滚动
      setTimeout(() => {
        const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }, 100);
    }
  }, [chatMessages, showChat, isChatLoading])

  // 聊天模式下自动聚焦输入框
  useEffect(() => {
    if (showChat && chatInputRef.current && !isChatLoading) {
      chatInputRef.current.focus()
    }
  }, [showChat, isChatLoading])

  const handleAccept = useCallback(() => {
    // 优先使用编辑后的文本，其次是当前迭代文本
    const finalText = isEditing ? editedText : currentIterationText
    onAccept(finalText)
    onClose()
  }, [isEditing, editedText, currentIterationText, onAccept, onClose])

  const handleReject = useCallback(() => {
    onReject()
    onClose()
  }, [onReject, onClose])

  const handleEdit = useCallback(() => {
    setIsEditing(true)
    setShowChat(false)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditedText(currentIterationText)
  }, [currentIterationText])

  // 处理编辑模式下的键盘事件
  const handleEditKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleCancelEdit()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (editedText.trim()) {
        setCurrentIterationText(editedText)
        setIsEditing(false)
      }
    }
  }, [editedText, handleCancelEdit, setCurrentIterationText, setIsEditing])

  const handleStartChat = useCallback(() => {
    setShowChat(true)
    setIsEditing(false)
    
    // 添加初始消息
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: t('chat.initialMessage'),
        timestamp: Date.now()
      }])
    }
  }, [chatMessages.length, t])

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !onContinueChat || isChatLoading) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput.trim(),
      timestamp: Date.now()
    }

    console.log('[AIResultModal] Sending message:', userMessage.content);
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      // 添加调试信息
      console.log('[AIResultModal] Calling onContinueChat with:', {
        message: userMessage.content,
        currentText: currentIterationText.substring(0, 100) + '...'
      });
      
      const response = await onContinueChat(userMessage.content, currentIterationText)
      console.log('[AIResultModal] Received response:', response);
      
      if (!response || response.trim() === '') {
        throw new Error('AI returned an empty response');
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `${t('chat.adjustedPrefix')}${response}`,
        timestamp: Date.now()
      }

      setChatMessages(prev => [...prev, assistantMessage])
      setCurrentIterationText(response)
      
    } catch (error) {
      console.error('[AIResultModal] Error in chat:', error);
      
      // 更详细的错误信息
      let errorContent = t('chat.errorMessage');
      if (error instanceof Error) {
        if (error.message.includes('AI processing failed')) {
          errorContent += `\n\n${t('chat.errorCauses')}`;
        } else if (error.message.includes('AI returned data format error')) {
          errorContent += `\n\n${t('chat.formatErrorMessage')}`;
        } else {
          errorContent += `\n\n${t('chat.errorDetails', { error: error.message })}`;
        }
      } else {
        errorContent += `\n\n${t('chat.unknownError')}`;
      }
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: Date.now()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }, [chatInput, onContinueChat, currentIterationText, isChatLoading])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // 完全禁用回车键发送，避免与日文输入法冲突
    if (e.key === 'Enter') {
      console.log('AI Result Modal: Enter key blocked for IME compatibility')
      e.preventDefault() // 阻止默认行为
      e.stopPropagation() // 阻止事件冒泡
      return false // 明确阻止事件
    }
  }, [])

  // 简单的文本差异高亮
  const renderDiff = useCallback(() => {
    const original = originalText.trim()
    const suggested = currentIterationText.trim()

    if (original === suggested) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>{t('states.noChanges')}</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-4" style={{ height: '400px' }}>
        {/* 原文 */}
        <div className="space-y-2 flex flex-col">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            {t('sections.original')}
          </h4>
          <div className="border border-red-200 rounded-lg p-3 bg-red-50 flex-1 overflow-y-auto">
            <div 
              className="whitespace-pre-wrap break-words word-wrap-break-word text-sm text-gray-800 font-sans leading-relaxed max-w-full overflow-wrap-anywhere"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                whiteSpace: 'pre-wrap'
              }}
            >
              {processEscapeCharacters(original)}
            </div>
          </div>
        </div>

        {/* AI建议 */}
        <div className="space-y-2 flex flex-col">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {t('sections.aiSuggestion')} {chatMessages.length > 1 && <span className="text-xs text-gray-500">{t('sections.iteratedLabel')}</span>}
          </h4>
          <div className="relative border border-green-200 rounded-lg bg-green-50 flex-1 overflow-hidden flex flex-col">
            {isEditing ? (
              // 编辑模式
              <div className="h-full flex flex-col">
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="flex-1 border-0 bg-white/80 resize-none rounded-none shadow-none focus:ring-0 focus:border-0 text-sm leading-relaxed p-3"
                  placeholder={t('placeholders.editContent')}
                  autoFocus
                  onKeyDown={handleEditKeyDown}
                />
                <div className="flex-shrink-0 p-3 border-t border-green-200 bg-green-100 flex items-center justify-between h-14">
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Edit3 className="h-3 w-3" />
                    {t('states.editingMode')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-8 px-3 text-xs text-gray-600 hover:text-gray-800"
                    >
                      {t('buttons.cancel')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCurrentIterationText(editedText)
                        setIsEditing(false)
                      }}
                      className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
                      disabled={editedText.trim() === ''}
                    >
                      {t('buttons.save')}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // 预览模式
              <div className="h-full flex flex-col">
                <div className="flex-1 p-3 overflow-y-auto">
                  <div 
                    className="whitespace-pre-wrap break-words word-wrap-break-word text-sm text-gray-800 font-sans leading-relaxed max-w-full overflow-wrap-anywhere"
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {processEscapeCharacters(suggested)}
                  </div>
                </div>
                <div className="flex-shrink-0 p-3 border-t border-green-200 bg-green-100 flex items-center justify-end gap-3 h-14">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 px-4 text-xs bg-white hover:bg-green-50 border-2 border-green-400 text-green-700 hover:text-green-800 flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Edit3 className="h-3 w-3" />
                    {t('buttons.edit')}
                  </Button>
                  {onContinueChat && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStartChat}
                      className="h-8 px-4 text-xs bg-white hover:bg-blue-50 border-2 border-blue-400 text-blue-700 hover:text-blue-800 flex items-center gap-2 font-medium shadow-sm"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {t('buttons.optimize')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }, [originalText, currentIterationText, chatMessages.length, isEditing, editedText, handleEdit, handleCancelEdit, handleStartChat, onContinueChat, handleEditKeyDown, t, setCurrentIterationText, setIsEditing])

  const renderChatMode = useCallback(() => {
    return (
      <div className="h-[500px] flex flex-col">
        {/* 当前文本显示 */}
        <div className="flex-shrink-0 mb-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            {t('sections.currentVersion')}
          </h4>
          <div className="border border-green-200 rounded-lg p-4 bg-green-50 max-h-32 overflow-y-auto">
            <div 
              className="text-sm text-gray-800 font-sans leading-relaxed whitespace-pre-wrap break-words word-break overflow-wrap-anywhere hyphens-auto"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                whiteSpace: 'pre-wrap'
              }}
            >
              {processEscapeCharacters(currentIterationText)}
            </div>
          </div>
        </div>

        {/* 对话历史 - 新的全宽设计 */}
        <div className="flex-1 border rounded-lg bg-gray-50 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div key={`message-${index}-${message.timestamp}`} className="w-full">
                  {/* 消息头部 */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    )}>
                      {message.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {message.role === 'user' ? t('chat.userLabel') : t('chat.assistantLabel')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* 消息内容 - 全宽显示 */}
                  <div className={cn(
                    "w-full p-4 rounded-lg border text-sm leading-relaxed",
                    message.role === 'user'
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 text-gray-800'
                  )}>
                    <div 
                      className="whitespace-pre-wrap break-words word-break font-sans overflow-wrap-anywhere hyphens-auto"
                      style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {processEscapeCharacters(message.content)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 加载状态 */}
              {isChatLoading && (
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <Bot className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {t('chat.assistantLabel')}
                    </span>
                    <span className="text-xs text-gray-400">{t('chat.thinking')}</span>
                  </div>
                  <div className="w-full p-4 rounded-lg border bg-white border-gray-200 flex items-center gap-3">
                    <RefreshCw className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-gray-600 break-words overflow-wrap-anywhere">{t('chat.processing')}</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 输入区域 */}
        <div className="flex-shrink-0 mt-4">
          <div className="flex gap-3">
            <Input
              ref={chatInputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholders.chatInput')}
              disabled={isChatLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isChatLoading}
              size="sm"
              className="px-4"
            >
              {isChatLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }, [currentIterationText, chatMessages, isChatLoading, chatInput, handleSendMessage, handleKeyDown, t])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "overflow-hidden flex flex-col",
          showChat 
            ? "max-w-[85vw] sm:max-w-[75vw] max-h-[95vh]" 
            : "max-w-[80vw] sm:max-w-[60vw] max-h-[90vh]"
        )}
        style={{ zIndex: 9999 }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className={cn("flex items-center gap-1.5", ACTION_COLORS[actionType] || ACTION_COLORS.custom)}
            >
              {ACTION_ICONS[actionType] || ACTION_ICONS.custom}
              {actionLabel}
            </Badge>
            <span className="text-lg">{t('title')}</span>
            {chatMessages.length > 1 && (
              <Badge variant="outline" className="text-xs">
                {t('iteratedBadge', { times: Math.floor((chatMessages.length - 1) / 2) })}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* 主要内容区域 */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-500">{t('loading')}</p>
              </div>
            </div>
          ) : showChat ? (
            renderChatMode()
          ) : (
            renderDiff()
          )}
        </div>

        {/* 操作按钮区域 */}
        {!isLoading && (
          <div className="flex-shrink-0 border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowChat(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t('buttons.viewComparison')}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleReject}
                className="flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                {t('buttons.reject')}
              </Button>
              
              <Button
                onClick={handleAccept}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                {t('buttons.accept')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AIResultModal 