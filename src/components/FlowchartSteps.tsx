'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Settings2,
  Lightbulb,
  PenTool,
  Send,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface FlowchartStepsProps {
  className?: string;
  onLinkClick?: (path: string) => void; // Callback for when a link inside the flowchart is clicked
}

const FlowchartSteps = ({ className, onLinkClick }: FlowchartStepsProps) => {
  const router = useRouter();
  const t = useTranslations('flowchart');

  const handleStepLinkClick = (path: string) => {
    router.push(path);
    if (onLinkClick) {
      onLinkClick(path);
    }
  };

  // Define flowSteps data using translations
  const flowSteps = [
    {
      id: 1,
      title: t('steps.step1.title'),
      icon: Settings2,
      description: t('steps.step1.description'),
      links: [
        { text: t('steps.step1.links.setupStyleProfiles'), path: '/style-profiles' },
        { text: t('steps.step1.links.manageMerchandise'), path: '/merchandise' },
      ],
    },
    {
      id: 2,
      title: t('steps.step2.title'),
      icon: Lightbulb,
      description: t('steps.step2.description'),
      links: [{ text: t('steps.step2.links.viewOutlines'), path: '/outlines' }],
    },
    {
      id: 3,
      title: t('steps.step3.title'),
      icon: PenTool,
      description: t('steps.step3.description'),
      links: [{ text: t('steps.step3.links.draftArticles'), path: '/articles' }],
    },
    {
      id: 4,
      title: t('steps.step4.title'),
      icon: Send,
      description: t('steps.step4.description'),
      links: [{ text: t('steps.step4.links.startPublishing'), path: '/publishing/new' }],
    },
  ];

  return (
    <div className={className}>
      <h2 className="text-2xl font-semibold mb-8 text-center text-card-foreground">
        {t('title')}
      </h2>
      {/* Adjusted breakpoints for responsiveness, matching HelpGuide.tsx's latest version */}
      <div className="flex flex-col lg:flex-row items-stretch justify-between lg:space-x-1">
        {flowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Card structure, ensure min-w, padding, and margin match HelpGuide's successful state */}
            <div className="flex-1 bg-background p-2 lg:p-3 rounded-lg border border-border hover:shadow-md transition-shadow min-w-[170px] flex flex-col mb-4 lg:mb-0">
              <div className="flex items-center mb-2">
                <step.icon className="h-6 w-6 mr-2 text-primary" />
                <h3 className="text-sm lg:text-md font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3 flex-grow">
                {step.description}
              </p>
              <div className="space-y-1.5 mt-auto">
                {step.links.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleStepLinkClick(link.path)}
                    className="w-full text-xs bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 rounded-md font-medium transition-colors duration-150 ease-in-out block text-left"
                  >
                    {link.text} &rarr;
                  </button>
                ))}
              </div>
            </div>
            {index < flowSteps.length - 1 && (
              <div className="hidden lg:flex items-center justify-center px-0 shrink-0">
                <ChevronRight className="h-6 w-6 text-muted-foreground/60" />
              </div>
            )}
            {index < flowSteps.length - 1 && (
              <div className="flex lg:hidden items-center justify-center py-2 shrink-0">
                <ChevronDown className="h-6 w-6 text-muted-foreground/60" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FlowchartSteps;
