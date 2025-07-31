/**
 * Custom Input Dialog Component
 * 
 * Replaces system-level window.prompt with UI-consistent input experience
 */

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

export interface InputDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  description?: string
  placeholder?: string
  defaultValue?: string
  type?: 'text' | 'url'
  variant?: 'link' | 'image' | 'default'
}

export function InputDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  placeholder = '',
  defaultValue = '',
  type = 'text',
  variant = 'default'
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue)
  const [isValid, setIsValid] = useState(true)
  const tCommon = useTranslations('common')

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue)
      setIsValid(true)
    }
  }, [isOpen, defaultValue])

  // URL validation
  const validateUrl = (url: string) => {
    if (!url.trim()) return false
    try {
      new URL(url)
      return true
    } catch {
      // If not a complete URL, check if it's a relative path or simple link
      return url.includes('.') || url.startsWith('/') || url.startsWith('#')
    }
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    if (type === 'url' && newValue.trim()) {
      setIsValid(validateUrl(newValue))
    } else {
      setIsValid(true)
    }
  }

  // Handle confirm
  const handleConfirm = () => {
    const trimmedValue = value.trim()
    if (!trimmedValue) return
    
    if (type === 'url' && !validateUrl(trimmedValue)) {
      setIsValid(false)
      return
    }

    onConfirm(trimmedValue)
    onClose()
  }

  // Handle cancel
  const handleCancel = () => {
    setValue('')
    onClose()
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  // Get icon
  const getIcon = () => {
    switch (variant) {
      case 'link':
        return <LinkIcon className="h-5 w-5 text-blue-600" />
      case 'image':
        return <ImageIcon className="h-5 w-5 text-green-600" />
      default:
        return null
    }
  }

  // Get label text
  const getLabelText = () => {
    switch (variant) {
      case 'link':
        return tCommon('dialog.linkUrl', { fallback: 'Link URL' })
      case 'image':
        return tCommon('dialog.imageUrl', { fallback: 'Image URL' })
      default:
        return tCommon('dialog.inputContent', { fallback: 'Input Content' })
    }
  }

  // Get validation error text
  const getValidationError = () => {
    const itemType = variant === 'link' ? tCommon('dialog.link', { fallback: 'link' }) : tCommon('dialog.image', { fallback: 'image' })
    return tCommon('dialog.validationError', { 
      type: itemType,
      fallback: `Please enter a valid ${itemType} URL`
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="input-value">
              {getLabelText()}
            </Label>
            <Input
              id="input-value"
              type={type}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className={`${!isValid ? 'border-red-500 focus:border-red-500' : ''}`}
              autoFocus
            />
            {!isValid && (
              <p className="text-sm text-red-600">
                {getValidationError()}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {tCommon('cancel')}
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!value.trim() || !isValid}
          >
            {tCommon('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InputDialog 