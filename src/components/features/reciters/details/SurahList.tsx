'use client';

import { useContext, useMemo, useState, useEffect } from 'react';
import { Audio, AudioContext } from '../../../context/AudioContext';
import Image from 'next/image';
import { IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { generateServerUrlId } from '@/helpers/utils';
import Cookies from 'js-cookie';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

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

  // Infinite Scroll Logic
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setVisibleCount(24);
  }, [text, reciter.id, current]);

  const visibleSurahs = useMemo(() => {
    return availableSurahs.slice(0, visibleCount);
  }, [availableSurahs, visibleCount]);

  const loadMore = () => {
    if (visibleCount < availableSurahs.length) {
      setVisibleCount(prev => Math.min(prev + 24, availableSurahs.length));
    }
  };

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
    <div className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {visibleSurahs.map((surah) => (
          <div
            key={surah.id}
            onClick={() => handlePlayAudio(surah)}
            className={`
              group transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-2xl rounded-lg cursor-pointer
              ${activeSurah?.id === surah.id
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
              }
            `}
          >
            <div className="w-full h-full">
              <div className="min-h-[60px] p-3 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-lg shadow-lg relative">
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => toggleFavorite(e, surah.id)}
                    className="text-primary hover:text-primary-dark"
                  >
                    {favorites.includes(surah.id) ? (
                      <HeartIconSolid className="h-5 w-5" />
                    ) : (
                      <HeartIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Image
                    src="/quran-icon.png"
                    width={40}
                    height={40}
                    alt={`Surah ${surah.name}`}
                    className="transition-transform group-hover:rotate-12"
                  />
                  <span className="absolute -top-3 -right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {surah.id}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {surah.name}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* Infinite scroll sentinel */}
        {visibleCount < availableSurahs.length && (
          <div
            className="col-span-full h-10 w-full"
            ref={(el) => {
              if (el) {
                const observer = new IntersectionObserver(
                  (entries) => {
                    if (entries[0].isIntersecting) {
                      loadMore();
                    }
                  },
                  { rootMargin: '200px' }
                );
                observer.observe(el);
                return () => observer.disconnect();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
