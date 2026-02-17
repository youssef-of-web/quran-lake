'use client';
import { IReciter } from '@/types/Reciter';
import Reciter from './Reciter';
import { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/intl';
import { Search } from 'lucide-react';

interface IReciters {
  readonly reciters: IReciter[];
}

export default function Reciters({ reciters }: IReciters) {
  const [text, setText] = useState<string>('');
  const locale = useLocale();
  const t = useTranslations('Reciters');
  const t_search = useTranslations('Search');

  const filetredReciters = useMemo(() => {
    if (text != '') {
      return reciters.filter((reciter) =>
        reciter.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    return reciters;
  }, [text, reciters]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-background-dark ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
        {/* Header with Back Button */}
        <div className={`flex items-center justify-between ${locale === 'ar' ? 'gap-4' : 'gap-4'} mb-8`}>
          <Link href="/">
            <button 
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined rotate-0 rtl:rotate-180">arrow_back</span>
            </button>
          </Link>
          <div className={`flex-1 ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{t('title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {locale === 'en' ? 'Explore the best voices of the Quran' : 'استكشف أجمل أصوات القراء'}
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
              placeholder={t_search('placeholderReciters')}
              value={text}
              onChange={onChange}
              className="block w-full rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 py-3 pl-12 rtl:pl-4 rtl:pr-12 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Reciters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filetredReciters?.map((reciter) => (
              <motion.div
                key={reciter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                layout
              >
                <Reciter {...reciter} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
