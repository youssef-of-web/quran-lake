'use client';

import { useContext, useMemo, useState, useEffect } from 'react';
import { Audio, AudioContext } from '../../../context/AudioContext';
import { IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { generateServerUrlId } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';

interface SurahListProps {
  readonly current: number;
  readonly reciter: IReciter;
  readonly text: string;
  readonly surah_list: Surah[];
}

export default function SurahList({
  current,
  reciter,
  text,
  surah_list,
}: SurahListProps) {
  const {
    setReciter,
    setServer,
    setOpen,
    setSurah,
    surah: activeSurah,
    setSuratList,
  } = useContext(AudioContext) as Audio;

  const locale = useLocale();
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedFavorites = Cookies.get('favoriteSurahs');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const moshaf = reciter?.moshaf![current];

  const availableSurahs = useMemo(() => {
    const surahs = surah_list?.filter((surah) =>
      moshaf.surah_list.split(',').includes(surah.id.toString())
    );

    return text
      ? surahs.filter((surah) =>
        surah.name.toLowerCase().includes(text.toLowerCase())
      )
      : surahs;
  }, [surah_list, moshaf.surah_list, text]);

  const handlePlayAudio = (surah: Surah) => {
    setReciter(reciter);
    setServer(
      `${moshaf.server}${generateServerUrlId(surah.id.toString())}.mp3`
    );
    setOpen(true);
    setSurah(surah);
    setSuratList(availableSurahs);
  };

  const toggleFavorite = (e: React.MouseEvent, surahId: number) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(surahId)
      ? favorites.filter((id) => id !== surahId)
      : [...favorites, surahId];

    setFavorites(newFavorites);
    Cookies.set('favoriteSurahs', JSON.stringify(newFavorites), {
      expires: 365,
    });
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {availableSurahs.map((surah) => (
          <motion.div
            key={surah.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onClick={() => handlePlayAudio(surah)}
            className={`
              group relative bg-white dark:bg-surface-dark border rounded-3xl p-6 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm
              ${activeSurah?.id === surah.id
                ? 'border-2 border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-primary-light/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2'
              }
            `}
          >
            <div className={`absolute top-6 ${locale === 'ar' ? 'left-6' : 'right-6'} opacity-0 ${locale === 'ar' ? '-translate-x-4' : 'translate-x-4'} group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                <span className="material-symbols-outlined text-xl">play_arrow</span>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-background-dark text-slate-400 dark:text-slate-500 font-mono text-lg font-black border border-slate-200 dark:border-slate-800 group-hover:border-primary-light transition-colors relative ${locale === 'ar' ? 'order-1' : ''}`}>
                {surah.id}
                <button
                  onClick={(e) => toggleFavorite(e, surah.id)}
                  className={`absolute ${locale === 'ar' ? '-top-1 -left-1' : '-top-1 -right-1'} text-slate-400 hover:text-accent-green dark:hover:text-accent-green transition-colors z-10`}
                  aria-label="Favorite"
                >
                  {favorites.includes(surah.id) ? (
                    <HeartIconSolid className="h-4 w-4 fill-accent-green text-accent-green" />
                  ) : (
                    <HeartIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className={`flex flex-col gap-1 flex-1 ${locale === 'ar' ? 'order-2' : ''}`}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                  {surah.name}
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  {locale === 'en' ? 'Surah' : 'سورة'}
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
