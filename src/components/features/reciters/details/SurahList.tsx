'use client';

import { useContext, useMemo } from 'react';
import { Audio, AudioContext } from '../../../context/AudioContext';
import Image from 'next/image';
import { IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { generateServerUrlId } from '@/helpers/utils';

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
  } = useContext(AudioContext) as Audio;

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
  };

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {availableSurahs.map((surah) => (
          <div
            key={surah.id}
            onClick={() => handlePlayAudio(surah)}
            className={`
              group transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-2xl rounded-lg cursor-pointer
              ${
                activeSurah?.id === surah.id
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }
            `}
          >
            <div className="w-full h-full">
              <div className="min-h-[60px] p-3 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg">
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
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {surah.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
