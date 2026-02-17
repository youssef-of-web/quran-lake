'use client';
import { Audio, AudioContext } from '../../context/AudioContext';
import { useContext } from 'react';
import { defaultReciter } from '@/data/data';
import { Suwar } from '@/types/Surah';
import Button from '../../ui/Button';
import { generateServerUrlId } from '@/helpers/utils';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { getAyahCount } from '@/data/surahAyahCounts';
import { getSurahEnglishName, getSurahEnglishTranslation } from '@/data/surahNames';

interface ISurahSection {
  suwar: Suwar;
}

export default function SurahSection({ suwar }: ISurahSection) {
  const { setReciter, setServer, setOpen, setSurah, setSuratList } = useContext(
    AudioContext
  ) as Audio;
  const t = useTranslations('Reciters');
  const locale = useLocale();

  const suratList = suwar?.suwar;
  /* from context @see ./context/AudioContext */

  const PlayAudio = (surah: any) => {
    defaultReciter.name = t('default.name');
    setReciter(defaultReciter);
    setOpen(true);
    setSurah(surah);
    setSuratList(suratList!);
    setServer(
      `${defaultReciter.moshaf[0].server}${generateServerUrlId(
        surah.id.toString()
      )}.mp3`
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 400,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
          {suratList?.map((surah) => (
            <motion.div
              key={surah.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onClick={() => PlayAudio(surah)}
              className="group relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-primary-light/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 cursor-pointer overflow-hidden shadow-sm"
            >
              <div className={`absolute top-6 ${locale === 'ar' ? 'left-6' : 'right-6'} opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                  <span className="material-symbols-outlined text-xl">play_arrow</span>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-background-dark text-slate-400 dark:text-slate-500 font-mono text-lg font-black border border-slate-200 dark:border-slate-800 group-hover:border-primary-light transition-colors">
                  {surah.id}
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                    {locale === 'en' ? getSurahEnglishName(surah.id) : surah.name}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    {locale === 'en' ? getSurahEnglishTranslation(surah.id) : surah.name}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between">
                <div className="flex flex-col gap-1 text-left rtl:text-right">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                    {surah.makkia === 1 ? (locale === 'en' ? 'Meccan' : 'مكية') : (locale === 'en' ? 'Medinan' : 'مدنية')}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full">
                    {surah.verses_count || surah.number_of_ayahs || getAyahCount(surah.id)} {locale === 'en' ? 'Ayahs' : 'آية'}
                  </span>
                </div>
                <span className={`${locale === 'en' ? 'text-xl' : 'text-xl'} text-slate-600 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-white group-hover:scale-110 transition-all duration-500`}>
                  {surah.name}
                </span>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
          ))}
      </motion.div>
    </motion.section>
  );
}

function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}
