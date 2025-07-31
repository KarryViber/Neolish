/**
 * Custom Confirm Dialog Component
 * 
 * Replaces system-level window.confirm with UI-consistent confirmation experience
 */

import React from 'react'
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
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel?: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'warning' | 'danger' | 'info' | 'success'
  children?: React.ReactNode
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'default',
  children
}: ConfirmDialogProps) {
  const tCommon = useTranslations('common')

  // Use provided text or fallback to translations
  const finalConfirmText = confirmText || tCommon('confirm')
  const finalCancelText = cancelText || tCommon('cancel')

  // Handle confirm
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onClose()
  }

  // Get icon and styles
  const getVariantConfig = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
      case 'danger':
        return {
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          confirmButtonClass: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'info':
        return {
          icon: <Info className="h-6 w-6 text-blue-600" />,
          confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-600" />,
          confirmButtonClass: 'bg-green-600 hover:bg-green-700 text-white'
        }
      default:
        return {
          icon: null,
          confirmButtonClass: ''
        }
    }
  }

  const { icon, confirmButtonClass } = getVariantConfig()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {icon}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-left">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            {finalCancelText}
          </Button>
          <Button 
            onClick={handleConfirm}
            className={`w-full sm:w-auto ${confirmButtonClass}`}
          >
            {finalConfirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmDialog 