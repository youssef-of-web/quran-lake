'use client';
import { Link, usePathname } from '@/lib/intl';
import { IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = useTranslations('Search');
  const tNav = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const currentIndex = surah_list.findIndex((s) => s.id === surah.id);

  const nextSurah =
    currentIndex < surah_list.length - 1
      ? surah_list[currentIndex + 1]
      : undefined;

  const prevSurah = currentIndex > 0 ? surah_list[currentIndex - 1] : undefined;

  const options = recitersList.map((r) => ({
    label: r.name,
    value: r.id.toString(),
  }));

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: surah?.name,
        artist: reciter.name,
        album: 'Quran Recitation',
        artwork: [
          {
            src: ``,
            sizes: '96x96',
            type: 'image/jpeg',
          },
        ],
      });

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
    }
  }, [reciter, surah, prevSurah, nextSurah, playAudio]);

  const translations = {
    selectSurah: locale === 'en' ? "Select a Surah" : "اختر سورة",
    chooseReciter: locale === 'en' ? "Choose a reciter to start" : "اختر قارئاً للبدء",
  };

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!surah || !reciter) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  // Close mobile menu when clicking outside or when pathname changes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu && !(event.target as Element).closest('.audio-player-menu')) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMobileMenu]);

  // Close menu when navigating
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  return (
    <div className={`audio-player-menu fixed bottom-0 left-0 right-0 z-[100] border-t transition-all duration-500 ${
      isDark 
        ? 'border-slate-800 bg-surface-dark/95' 
        : 'border-slate-200 bg-white/95'
    } backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.5)] ${
      isMinimized ? 'py-2 px-3 sm:px-4' : 'px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5'
    }`}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:gap-4">
        
        {/* Minimized View */}
        {isMinimized ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Info - Compact */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="overflow-hidden text-left rtl:text-right flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate">
                  {surah.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {reciter.name}
                </p>
              </div>
            </div>

            {/* Progress Bar - Compact */}
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 min-w-[2rem]">
                {formatTime(currentTime)}
              </span>
              <div 
                className="relative h-1 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute left-0 top-0 h-full rounded-full bg-accent-green transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 min-w-[2rem]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Reciter Select - Compact */}
            <div className="hidden md:block w-32 lg:w-40">
              <Select
                onChange={(e) =>
                  playAudio(
                    surah,
                    recitersList.find((r) => r.id === +e?.value!)!
                  )
                }
                value={options.find(opt => opt.value === reciter.id.toString())}
                options={options}
                menuPlacement="top"
                isSearchable={false}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: '0.5rem',
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                    border: isDark 
                      ? state.isFocused ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)' 
                      : state.isFocused ? '1px solid rgba(14, 57, 88, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: state.isFocused 
                      ? (isDark ? '0 0 0 2px rgba(255, 255, 255, 0.1)' : '0 0 0 2px rgba(14, 57, 88, 0.1)')
                      : 'none',
                    minHeight: '36px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 50,
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.75rem',
                    boxShadow: isDark 
                      ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                      : '0 10px 40px rgba(0, 0, 0, 0.1)',
                    marginTop: '4px',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                      ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(14, 57, 88, 0.1)')
                      : 'transparent',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                  }),
                  indicatorSeparator: () => ({ display: 'none' }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    color: isDark ? '#94a3b8' : '#64748b',
                    padding: '4px',
                  }),
                }}
              />
            </div>

            {/* Play Button - Compact */}
            <button 
              onClick={handlePlayPause}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-white dark:bg-white dark:text-primary hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20 dark:shadow-white/10 shrink-0"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl fill-current">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            {/* Expand Toggle */}
            <button 
              onClick={() => setIsMinimized(false)}
              className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors shrink-0"
              aria-label="Expand"
            >
              <span className="material-symbols-outlined text-xl">expand_less</span>
            </button>
          </div>
        ) : (
          <>
            {/* Top Row: Track Info & Controls */}
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <div className="overflow-hidden text-left rtl:text-right flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white truncate">
                    {surah.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {reciter.name}
                  </p>
                </div>
              </div>

              {/* Desktop Controls */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
                {/* Volume Control */}
                <div className="flex items-center gap-2 group">
                  <button className="text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-white transition-colors shrink-0" aria-label="Volume">
                    <span className="material-symbols-outlined text-xl">volume_up</span>
                  </button>
                  <div 
                    className="h-1.5 w-20 xl:w-24 rounded-full bg-slate-100 dark:bg-slate-800 cursor-pointer overflow-hidden relative"
                    onClick={handleVolumeChange}
                  >
                    <div 
                      className={`absolute left-0 top-0 h-full transition-all ${
                        isDark 
                          ? 'bg-slate-500 group-hover:bg-accent-green' 
                          : 'bg-slate-400 group-hover:bg-accent-green'
                      }`}
                      style={{ width: `${volume * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Reciter Select */}
                <div className="w-36 xl:w-44">
                  <Select
                    onChange={(e) =>
                      playAudio(
                        surah,
                        recitersList.find((r) => r.id === +e?.value!)!
                      )
                    }
                    value={options.find(opt => opt.value === reciter.id.toString())}
                    options={options}
                    menuPlacement="top"
                    isSearchable={false}
                    placeholder={locale === 'en' ? 'Change Reciter' : 'تغيير القارئ'}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                        border: isDark 
                          ? state.isFocused ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)' 
                          : state.isFocused ? '1px solid rgba(14, 57, 88, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: state.isFocused 
                          ? (isDark ? '0 0 0 3px rgba(255, 255, 255, 0.1)' : '0 0 0 3px rgba(14, 57, 88, 0.1)')
                          : 'none',
                        minHeight: '40px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 50,
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '0.75rem',
                        boxShadow: isDark 
                          ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                          : '0 10px 40px rgba(0, 0, 0, 0.1)',
                        marginTop: '4px',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(14, 57, 88, 0.1)')
                          : 'transparent',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                      }),
                      indicatorSeparator: () => ({ display: 'none' }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: isDark ? '#94a3b8' : '#64748b',
                        padding: '6px',
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Mobile Menu Toggle & Minimize */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="hidden md:block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors shrink-0"
                  aria-label="Minimize"
                >
                  <span className="material-symbols-outlined text-xl">expand_more</span>
                </button>
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors shrink-0"
                  aria-label="Menu"
                >
                  <span className="material-symbols-outlined text-2xl">
                    {showMobileMenu ? 'close' : 'menu'}
                  </span>
                </button>
              </div>
            </div>

            {/* Center Row: Controls & Progress - Centered */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 w-full">
              {/* Play Controls - Centered with Smaller Icons */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full">
                <button 
                  className="hidden md:block text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-colors"
                  aria-label="Shuffle"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">shuffle</span>
                </button>
                <button 
                  onClick={() => prevSurah && playAudio(prevSurah, reciter)}
                  disabled={!prevSurah}
                  className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl rotate-0 rtl:rotate-180">skip_previous</span>
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary text-white dark:bg-white dark:text-primary hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20 dark:shadow-white/10 mx-1 sm:mx-2"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <span className="material-symbols-outlined text-2xl sm:text-3xl md:text-4xl fill-current">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button 
                  onClick={() => nextSurah && playAudio(nextSurah, reciter)}
                  disabled={!nextSurah}
                  className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl rotate-0 rtl:rotate-180">skip_next</span>
                </button>
                <button 
                  className="hidden md:block text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-colors"
                  aria-label="Repeat"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">repeat</span>
                </button>
              </div>

              {/* Progress Bar - Centered */}
              <div className="flex w-full items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs font-bold font-mono text-slate-400 dark:text-slate-500 max-w-2xl mx-auto" dir="ltr">
                <span className="min-w-[2.5rem] sm:min-w-[3rem] text-center">{formatTime(currentTime)}</span>
                <div 
                  className="relative h-1.5 sm:h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden group cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-accent-green shadow-[0_0_10px_rgba(22,163,74,0.3)] transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                  <div 
                    className="absolute top-1/2 -mt-1.5 sm:-mt-2 h-3 w-3 sm:h-4 sm:w-4 -ml-1.5 sm:-ml-2 rounded-full bg-white dark:bg-slate-200 opacity-0 group-hover:opacity-100 shadow-xl transition-opacity border border-slate-200 dark:border-slate-700"
                    style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="min-w-[2.5rem] sm:min-w-[3rem] text-center">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden w-full pt-3 border-t border-slate-200 dark:border-slate-800"
                >
                  <div className="flex flex-col gap-4">
                    {/* Navigation Links */}
                    <div className="flex items-center justify-around gap-2">
                      <Link href="/" className={`flex-1 text-center py-2.5 px-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        pathname === '/' || pathname?.includes('/page')
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {tNav('logo')}
                      </Link>
                      <Link href="/reciters" className={`flex-1 text-center py-2.5 px-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        pathname?.includes('/reciters')
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {tNav('reciters')}
                      </Link>
                      <Link href="/prayer-times" className={`flex-1 text-center py-2.5 px-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        pathname?.includes('/prayer-times')
                          ? 'bg-accent-green text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {tNav('prayerTimes')}
                      </Link>
                    </div>

                    {/* Reciter Select - Mobile with Label */}
                    <div className="w-full">
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        {locale === 'en' ? 'Change Reciter' : 'تغيير القارئ'}
                      </label>
                      <Select
                        onChange={(e) => {
                          playAudio(
                            surah,
                            recitersList.find((r) => r.id === +e?.value!)!
                          );
                          setShowMobileMenu(false);
                        }}
                        value={options.find(opt => opt.value === reciter.id.toString())}
                        options={options}
                        menuPlacement="top"
                        isSearchable={true}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderRadius: '0.75rem',
                            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                            border: isDark 
                              ? state.isFocused ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)' 
                              : state.isFocused ? '1px solid rgba(14, 57, 88, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                            boxShadow: state.isFocused 
                              ? (isDark ? '0 0 0 3px rgba(255, 255, 255, 0.1)' : '0 0 0 3px rgba(14, 57, 88, 0.1)')
                              : 'none',
                            minHeight: '44px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 50,
                            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '0.75rem',
                            boxShadow: isDark 
                              ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
                              : '0 10px 40px rgba(0, 0, 0, 0.1)',
                            marginTop: '4px',
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(14, 57, 88, 0.1)')
                              : 'transparent',
                            color: isDark ? '#e2e8f0' : '#1e293b',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(14, 57, 88, 0.1)',
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: isDark ? '#e2e8f0' : '#1e293b',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }),
                          indicatorSeparator: () => ({ display: 'none' }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: isDark ? '#94a3b8' : '#64748b',
                            padding: '6px',
                            transition: 'transform 0.2s',
                          }),
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={server}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        autoPlay
      />
    </div>
  );
}
