'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  X,
} from 'lucide-react';
import FlowchartSteps from './FlowchartSteps';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

const HelpGuide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('help');

  if (pathname && pathname.startsWith('/editor/')) {
    return null;
  }

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFlowchartLinkAction = () => {
    toggleModal();
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg transition-transform duration-150 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-50"
        aria-label={t('title')}
      >
        <HelpCircle size={28} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in-0">
          <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full p-6 md:p-8 relative animate-in fade-in-0 zoom-in-95">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label={t('close')}
            >
              <X size={24} />
            </button>

            <FlowchartSteps onLinkClick={handleFlowchartLinkAction} />

            <div className="mt-10 text-center">
              <button
                onClick={toggleModal}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2.5 rounded-md text-base font-medium"
              >
                {t('gotIt')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpGuide;
