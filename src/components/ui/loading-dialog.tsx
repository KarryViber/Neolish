'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface LoadingDialogContentProps {
  /** 主要的loading标题 */
  title: string;
  /** 副标题或描述信息 */
  description?: string;
  /** 附加的提示信息 */
  hint?: string;
  /** Spinner的大小 */
  spinnerSize?: 'sm' | 'md' | 'lg';
  /** Spinner的颜色主题 */
  spinnerColor?: 'blue' | 'purple' | 'indigo' | 'green';
  /** 自定义容器类名 */
  className?: string;
  /** 是否显示垂直居中布局 */
  centered?: boolean;
}

/**
 * 统一的Loading弹窗内容组件
 * 
 * 用于替代各个页面中重复的loading UI代码
 * 支持自定义标题、描述、提示信息和样式
 */
export const LoadingDialogContent: React.FC<LoadingDialogContentProps> = ({
  title,
  description,
  hint,
  spinnerSize = 'lg',
  spinnerColor = 'blue',
  className,
  centered = true
}) => {
  // Spinner尺寸映射
  const spinnerSizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10', 
    lg: 'h-12 w-12'
  };

  // Spinner颜色映射
  const spinnerColorMap = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    green: 'text-green-600'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4",
      centered ? "py-10" : "p-6",
      className
    )}>
      <Loader2 
        className={cn(
          "animate-spin",
          spinnerSizeMap[spinnerSize],
          spinnerColorMap[spinnerColor]
        )} 
      />
      
      <div className="text-center space-y-2">
        <p className="text-lg text-gray-700 dark:text-slate-300 font-medium">
          {title}
        </p>
        
        {description && (
          <p className="text-sm text-gray-600 dark:text-slate-400">
            {description}
          </p>
        )}
        
        {hint && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
};

export interface LoadingButtonProps {
  /** 是否处于loading状态 */
  isLoading: boolean;
  /** Loading时显示的图标尺寸 */
  iconSize?: number;
  /** Loading时的文字 */
  loadingText?: string;
  /** 正常状态的文字 */
  normalText: string;
  /** 正常状态的图标 */
  normalIcon?: React.ReactNode;
  /** 按钮样式变体 */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** 按钮尺寸 */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** 是否禁用按钮 */
  disabled?: boolean;
  /** 按钮类型 */
  type?: 'button' | 'submit';
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 带Loading状态的按钮组件
 * 
 * 统一管理按钮的loading状态显示
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  iconSize = 16,
  loadingText,
  normalText,
  normalIcon,
  variant = 'default',
  size = 'default',
  disabled,
  type = 'button',
  onClick,
  className
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn("flex items-center", className)}
    >
      {isLoading ? (
        <Loader2 size={iconSize} className="mr-2 animate-spin" />
      ) : normalIcon ? (
        <span className="mr-2">{normalIcon}</span>
      ) : null}
      {isLoading && loadingText ? loadingText : normalText}
    </Button>
  );
};

/**
 * Loading状态的预设配置工厂函数
 * 
 * 为常见的loading场景提供预设配置，支持国际化
 */
export const createLoadingPresets = (t: any) => ({
  // 大纲生成
  outlineGeneration: {
    title: t('modal.generating.title'),
    description: t('modal.generating.message'),
    hint: t('modal.generating.hint'),
    spinnerColor: 'blue' as const
  },
  
  // 商材分析
  merchandiseAnalysis: {
    title: t('modal.add.analyzing.title'),
    description: t('modal.add.analyzing.description'),
    hint: t('modal.add.analyzing.message'),
    spinnerColor: 'blue' as const
  },
  
  // 风格配置分析
  styleProfileAnalysis: {
    title: t('modal.analyzing.title'),
    description: t('modal.analyzing.description'),
    spinnerColor: 'blue' as const
  },
  
  // 文章生成
  articleGeneration: {
    title: t('loading'),
    description: t('generating'),
    spinnerColor: 'green' as const
  }
});

export default LoadingDialogContent; 