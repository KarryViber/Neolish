'use client';

import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { 
  validatePasswordStrength, 
  getPasswordStrengthColor,
  getPasswordStrengthBgColor,
  type PasswordStrengthResult 
} from '@/utils/passwordStrength';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
      )}
      <span className={met ? "text-green-700" : "text-red-600"}>
        {text}
      </span>
    </div>
  );
}

export function PasswordStrengthIndicator({ 
  password, 
  showRequirements = true,
  className 
}: PasswordStrengthIndicatorProps) {
  const strengthResult: PasswordStrengthResult = useMemo(() => {
    return validatePasswordStrength(password);
  }, [password]);

  const { score, feedbackKeys, requirements } = strengthResult;
  const strengthColor = getPasswordStrengthColor(score);
  const strengthBgColor = getPasswordStrengthBgColor(score);
  
  // 获取翻译
  const t = useTranslations('auth.passwordStrength');
  
  // 获取强度级别文本
  const getStrengthText = (score: number): string => {
    switch (score) {
      case 0: return t('levels.veryWeak');
      case 1: return t('levels.weak');
      case 2: return t('levels.fair');
      case 3: return t('levels.strong');
      case 4: return t('levels.veryStrong');
      default: return t('levels.veryWeak');
    }
  };

  if (!password) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* 强度条和级别 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={cn("text-sm font-medium", strengthColor)}>
            {getStrengthText(score)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              strengthBgColor
            )}
            style={{ width: `${(score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* 反馈信息 */}
      {feedbackKeys.length > 0 && (
        <div className="space-y-1">
          {feedbackKeys.map((key, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span>{t(`feedback.${key}`)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 详细要求 */}
      {showRequirements && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-700">{t('requirements.title')}</h4>
          <div className="grid gap-1">
            <RequirementItem 
              met={requirements.minLength} 
              text={t('requirements.minLength')} 
            />
            <RequirementItem 
              met={requirements.hasUppercase} 
              text={t('requirements.hasUppercase')} 
            />
            <RequirementItem 
              met={requirements.hasLowercase} 
              text={t('requirements.hasLowercase')} 
            />
            <RequirementItem 
              met={requirements.hasNumbers} 
              text={t('requirements.hasNumbers')} 
            />
            <RequirementItem 
              met={requirements.hasSpecialChars} 
              text={t('requirements.hasSpecialChars')} 
            />
            <RequirementItem 
              met={requirements.noCommonPasswords} 
              text={t('requirements.noCommonPasswords')} 
            />
          </div>
        </div>
      )}
    </div>
  );
} 