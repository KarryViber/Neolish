'use client';

import React from 'react';
import { CheckCircle, Edit3, Circle, HelpCircle } from 'lucide-react'; // Using lucide-react for icons
import { type StepConfig } from '../types'; // Ensure this path is correct
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface VerticalStepperProps {
  stepsConfig: StepConfig[];
  currentStepIndex: number;
  onStepSelect: (index: number) => void;
  articleId?: string; // Optional articleId for display
}

const VerticalStepper: React.FC<VerticalStepperProps> = ({
  stepsConfig,
  currentStepIndex,
  onStepSelect,
  articleId,
}) => {
  const t = useTranslations('publishing.verticalStepper');

  const getStepStatus = (index: number) => {
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
      {articleId && (
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">{t('publishing')}</h2>
          <p className="text-lg font-medium text-gray-800 dark:text-slate-100 truncate" title={articleId}>
            {articleId}
          </p>
        </div>
      )}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-3">
          {stepsConfig.map((step, index) => {
            const status = getStepStatus(index);
            let IconComponent;
            let iconColorClass = '';
            let textColorClass = '';
            let hoverBgClass = 'hover:bg-gray-100 dark:hover:bg-slate-700';

            switch (status) {
              case 'completed':
                IconComponent = CheckCircle;
                iconColorClass = 'text-green-500 dark:text-green-400';
                textColorClass = 'text-gray-700 dark:text-slate-300';
                break;
              case 'current':
                IconComponent = Edit3; // Or a more prominent icon like ChevronRight
                iconColorClass = 'text-blue-600 dark:text-blue-400';
                textColorClass = 'text-blue-600 dark:text-blue-400 font-semibold';
                hoverBgClass = 'hover:bg-blue-50 dark:hover:bg-blue-900/50'; // Slightly different hover for current
                break;
              case 'upcoming':
                IconComponent = Circle; // Simple circle for upcoming
                iconColorClass = 'text-gray-400 dark:text-slate-500';
                textColorClass = 'text-gray-500 dark:text-slate-400';
                break;
              default:
                IconComponent = HelpCircle;
                iconColorClass = 'text-gray-400 dark:text-slate-500';
                textColorClass = 'text-gray-500 dark:text-slate-400';
            }

            return (
              <li key={step.id}>
                <button
                  onClick={() => onStepSelect(index)}
                  className={`group flex w-full items-center p-3 rounded-md transition-colors duration-150 ease-in-out ${hoverBgClass} ${status === 'current' ? 'bg-blue-50 dark:bg-blue-900/60' : ''}`}
                  aria-current={status === 'current' ? 'step' : undefined}
                >
                  <span className="flex-shrink-0">
                    <IconComponent className={`h-6 w-6 ${iconColorClass}`} aria-hidden="true" />
                  </span>
                  <span className={`ml-3 text-sm font-medium ${textColorClass}`}>
                    {step.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      {/* You can add a spacer or other elements here if needed */}
      {/* <div className="flex-grow"></div> */}
      {/* Example: Logout or back button at the bottom of the stepper */}
      <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-700">
        <Link 
          href="/article-manager"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t('backToArticles')}
        </Link>
      </div>
      {/* <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-700">
        <Button variant="ghost" className="w-full justify-start text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Articles
        </Button>
      </div> */}
    </div>
  );
};

export default VerticalStepper; 