'use client';

import { IMoshaf, IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import Hero from '../../../Hero';
import Moshaf from './Moshaf';
import Surah_List from './SurahList';

interface DetailProps {
  reciter: IReciter;
  surah_list: Surah[];
}

export default function Detail({ reciter, surah_list }: DetailProps) {
  const [selectedMoshafIndex, setSelectedMoshafIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const t = useTranslations('Reciters');
  const t_search = useTranslations('Search');

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value.toLowerCase());
    },
    []
  );

  return (
    <section className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Hero
        title={`${t('reciter')} ${reciter.name}`}
        placeholder={t_search('placeholderSurah')}
        onChange={handleSearchChange}
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
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
