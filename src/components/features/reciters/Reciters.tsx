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
  const filetredReciters = useMemo(() => {
    if (text != '') {
      return reciters.filter((reciter) =>
        reciter.name.toLowerCase().includes(text)
      );
    }
    return reciters;
  }, [text]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.toLowerCase());
  };

  const translation = useTranslations('Reciters');
  const translation_search = useTranslations('Search');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero
        placeholder={translation_search('placeholderReciters')}
        onChange={onChange}
        title={translation('title')}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 container mx-auto px-2">
        <AnimatePresence mode="popLayout">
          {filetredReciters?.map((reciter) => (
            <motion.div
              key={reciter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Reciter {...reciter} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
