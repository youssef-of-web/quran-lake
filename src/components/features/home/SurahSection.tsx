'use client';
import { Audio, AudioContext } from '../../context/AudioContext';
import { useContext, useState, useMemo } from 'react';
import { defaultReciter } from '@/data/data';
import { Suwar } from '@/types/Surah';
import Button from '../../ui/Button';
import { generateServerUrlId } from '@/helpers/utils';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface ISurahSection {
  suwar: Suwar;
}

export default function SurahSection({ suwar }: ISurahSection) {
  const { setReciter, setServer, setOpen, setSurah, setSuratList } = useContext(
    AudioContext
  ) as Audio;
  const t = useTranslations('Reciters');

  const suratList = suwar?.suwar;
  /* from context @see ./context/AudioContext */

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleSuwar = useMemo(() => suratList?.slice(0, visibleCount), [suratList, visibleCount]);

  const loadMore = () => {
    if (suratList && visibleCount < suratList.length) {
      setVisibleCount(prev => Math.min(prev + 20, suratList.length));
    }
  };

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
        staggerChildren: 0.01,
        delayChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full py-12 md:py-24 lg:py-32"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          variants={containerVariants}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visibleSuwar?.map((surah) => (
            <motion.div
              key={surah.id}
              variants={itemVariants}
              whileHover="hover"
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-center justify-between">
                <motion.div className="space-y-1">
                  <h3 className="text-lg font-semibold">{surah.name}</h3>
                </motion.div>
                <div
                >
                  <Button onClick={() => PlayAudio(surah)}>
                    <PlayIcon className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Infinite scroll sentinel */}
          {suratList && visibleCount < suratList.length && (
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
        </motion.div>
      </div>
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
