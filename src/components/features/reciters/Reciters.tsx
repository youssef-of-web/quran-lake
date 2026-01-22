'use client';
import { IReciter } from '@/types/Reciter';
import Reciter from './Reciter';
import Hero from '../../Hero';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

interface IReciters {
  readonly reciters: IReciter[];
}

export default function Reciters({ reciters }: IReciters) {
  const [text, setText] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(24);

  const filetredReciters = useMemo(() => {
    if (text != '') {
      return reciters.filter((reciter) =>
        reciter.name.toLowerCase().includes(text)
      );
    }
    return reciters;
  }, [text, reciters]); // Added dependency reciters

  // Reset visible count when search text changes
  useMemo(() => {
    setVisibleCount(24);
  }, [text]);

  const visibleReciters = useMemo(() => {
    return filetredReciters.slice(0, visibleCount);
  }, [filetredReciters, visibleCount]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.toLowerCase());
  };

  const loadMore = () => {
    if (visibleCount < filetredReciters.length) {
      setVisibleCount(prev => Math.min(prev + 24, filetredReciters.length));
    }
  };

  const t = useTranslations('Reciters');
  const t_search = useTranslations('Search');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Hero
        placeholder={t_search('placeholderReciters')}
        onChange={onChange}
        title={t('title')}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 container mx-auto px-2">
        <AnimatePresence mode="popLayout">
          {visibleReciters?.map((reciter) => (
            <motion.div
              key={reciter.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Reciter {...reciter} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Infinite scroll sentinel */}
        <div
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting && visibleCount < filetredReciters.length) {
                    loadMore();
                  }
                },
                { rootMargin: '100px' }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
          className="col-span-full h-10 w-full"
        />
      </div>
    </motion.div>
  );
}
