'use client';
import { Link } from '@/lib/intl';
import { IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Music2,
  Download,
  Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Select from 'react-select';

interface IPlayer {
  reciter: IReciter;
  surah: Surah;
  server: string;
  recitersList: IReciter[];
  playAudio: (surah: Surah, reciter: IReciter) => void;
}

export default function AudioPlayer({
  reciter,
  surah,
  server,
  recitersList,
  playAudio,
}: IPlayer) {
  const [open, setOpen] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const t = useTranslations('Search');

  const options = recitersList.map((r) => ({
    label: r.name,
    value: r.id.toString(),
  }));

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(server);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reciter.name}-${surah?.name}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed bottom-0 w-full bg-gradient-to-r from-slate-600/80 via-slate-500/80 to-primary/80 backdrop-blur-lg shadow-lg"
        style={{ height: open ? '12rem' : '4rem' }}
      >
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
        <div className="relative max-w-3xl mx-auto p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/reciters/${reciter.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="font-medium text-white">{reciter.name}</p>
                  <p className="text-sm text-slate-200">{surah?.name}</p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="p-2 rounded-full hover:bg-slate-400/20 transition-colors disabled:opacity-50"
                  title="Download Audio"
                >
                  {isDownloading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Download className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setOpen(!open)}
                  className="p-2 rounded-full hover:bg-slate-400/20 transition-colors"
                >
                  {open ? (
                    <ChevronDown className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>

            <motion.div
              animate={{ opacity: open ? 1 : 0 }}
              className="space-y-4"
            >
              <audio
                controls
                autoPlay={true}
                src={server}
                loop
                className="w-full h-12 rounded-lg focus:outline-none"
              />

              <Select
                onChange={(e) =>
                  playAudio(
                    surah,
                    recitersList.find((r) => r.id === +e?.value!)!
                  )
                }
                placeholder={t('changeReciter')}
                options={options}
                className="w-full"
                menuPlacement="top"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: 'none',
                    color: 'white',
                    '&:hover': {
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'transparent',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'white',
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: 'rgba(255, 255, 255, 0.7)',
                  }),
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
