'use client';

import { Link } from '@/lib/intl';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

type Tab = 'popular' | 'reciters' | 'juz' | 'themes' | 'recently';

export default function SurahTabs() {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>('popular');

  const translations = {
    popularSurahs: locale === 'en' ? 'Popular Surahs' : 'السور الشائعة',
    reciters: locale === 'en' ? 'Reciters' : 'القراء',
    juz: locale === 'en' ? 'Juz' : 'الأجزاء',
    themes: locale === 'en' ? 'Themes' : 'المواضيع',
    recentlyPlayed: locale === 'en' ? 'Recently Played' : 'تم تشغيله مؤخراً',
  };

  return (
    <div className="flex overflow-x-auto pb-4 gap-8 mb-8 border-b border-slate-200 dark:border-slate-800 scrollbar-hide">
      <button 
        onClick={() => setActiveTab('popular')}
        className={`whitespace-nowrap pb-3 border-b-2 transition-colors font-medium text-sm tracking-wide ${
          activeTab === 'popular' 
            ? 'border-primary text-primary dark:text-white font-bold' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'
        }`}
      >
        {translations.popularSurahs}
      </button>
      <Link href="/reciters">
        <button 
          className="whitespace-nowrap pb-3 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors font-medium text-sm tracking-wide"
        >
          {translations.reciters}
        </button>
      </Link>
      <button 
        onClick={() => setActiveTab('juz')}
        className={`whitespace-nowrap pb-3 border-b-2 transition-colors font-medium text-sm tracking-wide ${
          activeTab === 'juz' 
            ? 'border-primary text-primary dark:text-white font-bold' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'
        }`}
      >
        {translations.juz}
      </button>
      <button 
        onClick={() => setActiveTab('themes')}
        className={`whitespace-nowrap pb-3 border-b-2 transition-colors font-medium text-sm tracking-wide ${
          activeTab === 'themes' 
            ? 'border-primary text-primary dark:text-white font-bold' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'
        }`}
      >
        {translations.themes}
      </button>
      <button 
        onClick={() => setActiveTab('recently')}
        className={`whitespace-nowrap pb-3 border-b-2 transition-colors font-medium text-sm tracking-wide ${
          activeTab === 'recently' 
            ? 'border-primary text-primary dark:text-white font-bold' 
            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'
        }`}
      >
        {translations.recentlyPlayed}
      </button>
    </div>
  );
}
