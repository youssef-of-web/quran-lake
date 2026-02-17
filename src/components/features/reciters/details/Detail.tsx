'use client';

import { IMoshaf, IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useCallback } from 'react';
import { Link } from '@/lib/intl';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Moshaf from './Moshaf';
import Surah_List from './SurahList';

interface DetailProps {
  reciter: IReciter;
  surah_list: Surah[];
}

export default function Detail({ reciter, surah_list }: DetailProps) {
  const [selectedMoshafIndex, setSelectedMoshafIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const locale = useLocale();

  const t = useTranslations('Reciters');
  const t_search = useTranslations('Search');

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value.toLowerCase());
    },
    []
  );

  return (
    <section className={`min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 space-y-8">
        {/* Header with Back Button */}
        <div className={`flex items-center justify-between ${locale === 'ar' ? 'gap-4' : 'gap-4'} mb-8`}>
          <Link href="/reciters">
            <button 
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-all"
            >
              <span className={`material-symbols-outlined ${locale === 'ar' ? 'rotate-180' : ''}`}>arrow_back</span>
            </button>
          </Link>
          <div className={`flex-1 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('reciter')} {reciter.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {locale === 'en' ? 'Select a moshaf and browse surahs' : 'اختر مصحفاً واستعرض السور'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group max-w-xl">
            <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center px-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input 
              type="text" 
              placeholder={t_search('placeholderSurah')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 py-3 pl-12 rtl:pl-4 rtl:pr-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Moshaf Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reciter.moshaf?.map((moshaf: IMoshaf, index: number) => (
            <Moshaf
              {...moshaf}
              key={moshaf.id}
              current={selectedMoshafIndex}
              setCurrent={setSelectedMoshafIndex}
              index={index}
            />
          ))}
        </div>

        {/* Surah List */}
        {reciter.moshaf && (
          <Surah_List
            current={selectedMoshafIndex}
            reciter={reciter}
            text={searchQuery}
            surah_list={surah_list}
          />
        )}
      </div>
    </section>
  );
}
