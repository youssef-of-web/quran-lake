'use client';

import { Link } from '@/lib/intl';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { randomQuranAyahQuote } from '@/constants';

interface IHeroSection { }

export default function HeroSection({ }: IHeroSection) {
  const t = useTranslations('Home');
  const locale = useLocale();
  const [ayah, setAyah] = useState<{ arabic: string; surah: string; ayah: number | string } | null>(null);

  useEffect(() => {
    // Get random ayah on component mount
    const randomAyah = randomQuranAyahQuote();
    setAyah(randomAyah);
  }, []);

  const translations = {
    ayahTitle: locale === 'en' ? 'Ayah of the Day' : 'آية اليوم',
    listenNow: locale === 'en' ? 'Listen Now' : 'استمع الآن',
  };
  
  return (
    <section className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-[#0a1e2f] to-slate-900 dark:to-black shadow-2xl border border-slate-200 dark:border-slate-800/50 group min-h-[400px] ${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="absolute inset-0 opacity-10 dark:opacity-25 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/islamic-pattern/1600/600')" }}></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 max-w-3xl text-center md:text-left rtl:md:text-right"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 w-fit mx-auto md:mx-0 border border-white/5 backdrop-blur-md"
          >
            <span className="size-2 rounded-full bg-accent-green animate-pulse"></span>
            <span className="text-xs font-bold text-blue-100 tracking-[0.2em] uppercase">
              {translations.ayahTitle}
            </span>
          </motion.div>

          <div className="space-y-6">
            {ayah ? (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="arabic-text text-4xl md:text-6xl lg:text-7xl font-bold leading-relaxed text-white drop-shadow-2xl"
                  dir="rtl"
                >
                  {ayah.arabic}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-xl md:text-2xl font-light text-blue-100/80 leading-relaxed italic border-l-2 rtl:border-l-0 rtl:border-r-2 border-accent-green/30 pl-6 rtl:pl-0 rtl:pr-6"
                >
                  <span className="text-sm font-bold opacity-60">{ayah.surah} - {locale === 'en' ? 'Ayah' : 'آية'} {ayah.ayah}</span>
                </motion.p>
              </>
            ) : (
              <>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold leading-relaxed text-white drop-shadow-2xl"
                >
                  {t('title')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-xl md:text-2xl font-light text-blue-100/80 leading-relaxed italic border-l-2 rtl:border-l-0 rtl:border-r-2 border-accent-green/30 pl-6 rtl:pl-0 rtl:pr-6"
                >
                  {t('subtitle')}
                </motion.p>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start pt-4"
          >
            <Link href="/reciters">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-2xl font-extrabold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
              >
                <span className="material-symbols-outlined fill-current">play_arrow</span>
                <span>{translations.listenNow}</span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden lg:block relative shrink-0"
        >
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-8 border-white/5 flex items-center justify-center bg-gradient-to-b from-primary/30 to-transparent backdrop-blur-xl shadow-2xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
            <span className="material-symbols-outlined text-8xl text-white/20 select-none">mosque</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-green/10 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
