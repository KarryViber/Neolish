import React from 'react';
import { useTranslations } from 'next-intl';

export default function NewArticlePage() {
  const t = useTranslations('articles.newArticle');
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">{t('title')} {t('form.selectOutline.label')}</h1>
      {/* Placeholder for new article wizard content */}
    </div>
  );
} 