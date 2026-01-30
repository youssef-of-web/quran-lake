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
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

interface IPlayer {
  reciter: IReciter;
  surah: Surah;
  server: string;
  recitersList: IReciter[];
  playAudio: (surah: Surah, reciter: IReciter) => void;
  surah_list: Surah[];
}

export default function AudioPlayer({
  reciter,
  surah,
  server,
  recitersList,
  playAudio,
  surah_list,
}: IPlayer) {
  const [open, setOpen] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = useTranslations('Search');

  const currentIndex = surah_list.findIndex((s) => s.id === surah.id);

  const nextSurah =
    currentIndex < surah_list.length - 1
      ? surah_list[currentIndex + 1]
      : undefined;

  const prevSurah = currentIndex > 0 ? surah_list[currentIndex - 1] : undefined;

  const options: { label: string; value: string }[] = recitersList.map((r) => ({
    label: r.name,
    value: r.id.toString(),
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: surah?.name,
        artist: reciter.name,
        album: 'Quran Recitation',
        artwork: [
          {
            src: '/quran.avif',
            sizes: '96x96',
            type: 'image/avif',
          },
        ],
      });

      const updateMediaSessionHandlers = () => {
        navigator.mediaSession.setActionHandler('play', () => {
          audioRef.current?.play();
          setIsPlaying(true);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          audioRef.current?.pause();
          setIsPlaying(false);
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => {
          if (prevSurah) {
            playAudio(prevSurah, reciter);
          }
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
          if (nextSurah) {
            playAudio(nextSurah, reciter);
          }
        });
      };

      updateMediaSessionHandlers();

      if (!open) {
        updateMediaSessionHandlers();
      }
    }
  }, [reciter, surah, prevSurah, nextSurah, playAudio, open]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

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
        className="fixed bottom-0 w-full bg-gradient-to-r from-slate-600/80 via-slate-500/80 to-primary/80 dark:from-slate-800/95 dark:via-slate-700/95 dark:to-slate-900/95 backdrop-blur-lg shadow-lg"
        style={{ height: open ? '16rem' : '4rem' }}
      >
        <div className="relative max-w-3xl mx-auto p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/reciters/${reciter.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-slate-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-white">{reciter.name}</p>
                  <p className="text-sm text-slate-200">{surah?.name}</p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {!open && (
                  <button
                    onClick={handlePlayPause}
                    className="p-2 rounded-full hover:bg-slate-400/20 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                )}
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
              <Select
                onChange={(option) => {
                  const value = option?.value;
                  if (!value) return;
                  const nextReciter = recitersList.find((r) => r.id === Number(value));
                  if (!nextReciter) return;
                  playAudio(surah, nextReciter);
                }}
                placeholder={t('changeReciter')}
                options={options}
                className="w-full mb-4"
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
                    zIndex: 50,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    if (prevSurah) {
                      playAudio(prevSurah, reciter);
                    }
                  }}
                  disabled={!prevSurah}
                  className="p-2 rounded-full hover:bg-slate-400/20 transition-colors disabled:opacity-50"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (nextSurah) {
                      playAudio(nextSurah, reciter);
                    }
                  }}
                  disabled={!nextSurah}
                  className="p-2 rounded-full hover:bg-slate-400/20 transition-colors disabled:opacity-50"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="relative w-full">
                <audio
                  ref={audioRef}
                  src={server}
                  loop
                  className="hidden"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  autoPlay
                />
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/30 hover:bg-white/40 transition-all cursor-pointer"
                    style={{
                      width: `${(currentTime / (duration || 1)) * 100}%`,
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      if (audioRef.current) {
                        audioRef.current.currentTime = percent * duration;
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-white/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
