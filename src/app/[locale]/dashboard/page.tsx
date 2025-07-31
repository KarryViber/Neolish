'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import FlowchartSteps from '@/components/FlowchartSteps';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');

  if (!session) {
    return <div>{tCommon('loading')}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <LayoutDashboard size={32} className="mr-3" /> 
        {t('title')}
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 -mt-6 mb-8 max-w-2xl">{t('description')}</p>
      
      {/* Temporary section for Mevius System Workflow */}
      <div className="bg-card p-6 rounded-lg shadow-md">
        <FlowchartSteps className="max-w-4xl mx-auto" /> 
        {/* Added max-w-4xl and mx-auto for better centering and width control of the flowchart itself */}
      </div>

      {/* You can add other dashboard content here in the future */}
      <div className="mt-8 text-center text-muted-foreground">
        <p>{t('underDevelopment')}</p>
      </div>
    </div>
  );
}