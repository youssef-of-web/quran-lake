'use client';

import { Link, usePathname } from '@/lib/intl';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import { Play, Pause, Volume2 } from 'lucide-react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { getNextPrayer, getTimeUntilNextPrayer } from '@/helpers/prayerTimes';

interface INavbar { }

export default function Navbar({ }: INavbar) {
  const t = useTranslations('Navigation');
  const tPrayer = useTranslations('PrayerTimes');
  const locale = useLocale();
  const pathname = usePathname();

  const { location, prayerTimes } = usePrayerTimes();
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; timeUntil: string } | null>(null);
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const [showFirstTimeAnimation, setShowFirstTimeAnimation] = useState(false);
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  const ADHAN_AUDIO_URL = '/adhan.mp3';

  // Memoized location check
  const hasLocation = useMemo(() => isLocationEnabled || location !== null, [isLocationEnabled, location]);

  // Initialize adhan audio element
  useEffect(() => {
    if (!adhanAudioRef.current) {
      adhanAudioRef.current = new Audio();
      adhanAudioRef.current.addEventListener('ended', () => setIsPlayingAdhan(false));
    }
    return () => {
      if (adhanAudioRef.current) {
        adhanAudioRef.current.removeEventListener('ended', () => setIsPlayingAdhan(false));
      }
    };
  }, []);

  // Play adhan function - memoized
  const playAdhan = useCallback(() => {
    if (!adhanAudioRef.current) return;

    adhanAudioRef.current.pause();
    adhanAudioRef.current.currentTime = 0;
    adhanAudioRef.current.src = ADHAN_AUDIO_URL;
    adhanAudioRef.current.volume = 0.8;
    adhanAudioRef.current.loop = false;
    setIsPlayingAdhan(true);

    adhanAudioRef.current.play().catch(() => setIsPlayingAdhan(false));
  }, []);

  // Stop adhan function - memoized
  const stopAdhan = useCallback(() => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
      adhanAudioRef.current.src = '';
    }
    setIsPlayingAdhan(false);
  }, []);

  // Toggle adhan - memoized
  const toggleAdhan = useCallback(() => {
    isPlayingAdhan ? stopAdhan() : playAdhan();
  }, [isPlayingAdhan, playAdhan, stopAdhan]);

  // Check geolocation permission status
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setIsLocationEnabled(false);
      return;
    }

    navigator.permissions?.query({ name: 'geolocation' })
      .then((result) => {
        setIsLocationEnabled(result.state === 'granted' || result.state === 'prompt');
        result.onchange = () => {
          setIsLocationEnabled(result.state === 'granted' || result.state === 'prompt');
        };
      })
      .catch(() => setIsLocationEnabled(true));
  }, []);

  // Update next prayer info
  useEffect(() => {
    if (!prayerTimes?.data?.timings) {
      setNextPrayerInfo(null);
      return;
    }

    const updatePrayerInfo = () => {
      const nextPrayerName = getNextPrayer(prayerTimes.data.timings);
      const timeUntil = getTimeUntilNextPrayer(prayerTimes.data.timings);
      setNextPrayerInfo({ name: nextPrayerName, timeUntil });
    };

    updatePrayerInfo();
    const interval = setInterval(updatePrayerInfo, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  // Close mobile menu handlers
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu-container') && !target.closest('button[aria-label="Menu"]')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Show first time animation when component mounts
  useEffect(() => {
    const hasVisited = localStorage.getItem('navbarAdhanVisited');
    if (!hasVisited) {
      setTimeout(() => {
        setShowFirstTimeAnimation(true);
        localStorage.setItem('navbarAdhanVisited', 'true');
      }, 2000);
    }
  }, []);

  // Show play hint animation periodically (only after first time animation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlayingAdhan && !showFirstTimeAnimation) {
        setShowPlayHint(true);
        setTimeout(() => setShowPlayHint(false), 3000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlayingAdhan, showFirstTimeAnimation]);

  // Memoized translations
  const translations = useMemo(() => ({
    nextPrayer: locale === 'en' ? "Next" : "القادم",
    inTime: locale === 'en' ? "in" : "خلال",
  }), [locale]);

  // Memoized button class names
  const buttonBaseClasses = useMemo(() => 
    'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all',
    []
  );

  const buttonInactiveClasses = useMemo(() =>
    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    []
  );

  const buttonActiveClasses = useMemo(() =>
    'bg-primary text-white',
    []
  );

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 px-6 lg:px-12 backdrop-blur-md">
      <Link href={'/'} className="flex items-center gap-4 cursor-pointer">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">auto_stories</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight hidden sm:block">{t('logo')}</h1>
      </Link>


      <div className="flex items-center gap-2 md:gap-4">
        {hasLocation && nextPrayerInfo && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-surface-dark rounded-full border border-slate-200 dark:border-slate-700/50">
            <span className="material-symbols-outlined text-accent-green text-sm">schedule</span>
            <span className="text-[10px] md:text-xs font-medium text-slate-600 dark:text-slate-300">
              {translations.nextPrayer}: <span className="text-primary dark:text-white font-bold">{tPrayer(`prayers.${nextPrayerInfo.name.toLowerCase()}`)}</span> {translations.inTime} {nextPrayerInfo.timeUntil}
            </span>
          </div>
        )}
        
        {/* Adhan Play Button */}
        <div className="relative">
          <motion.button
            onClick={() => {
              toggleAdhan();
              setShowPlayHint(false);
              setShowFirstTimeAnimation(false);
            }}
            className={`
              flex items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 overflow-visible
              ${isPlayingAdhan
                ? 'bg-gradient-to-br from-accent-green to-green-600 text-white shadow-lg shadow-accent-green/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isPlayingAdhan ? {
              boxShadow: [
                "0 0 0 0 rgba(22, 163, 74, 0.7)",
                "0 0 0 10px rgba(22, 163, 74, 0)",
                "0 0 0 0 rgba(22, 163, 74, 0)"
              ]
            } : showFirstTimeAnimation ? {
              scale: [1, 1.08, 1],
            } : showPlayHint ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={isPlayingAdhan ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            } : showFirstTimeAnimation ? {
              duration: 1.2,
              repeat: Infinity,
              repeatType: "reverse"
            } : showPlayHint ? {
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse"
            } : {}}
            title={isPlayingAdhan 
              ? (locale === 'ar' ? 'إيقاف الأذان' : 'Stop Adhan') 
              : (locale === 'ar' ? 'تشغيل الأذان' : 'Play Adhan')
            }
            aria-label={isPlayingAdhan ? 'Stop adhan' : 'Play adhan'}
          >
            {isPlayingAdhan ? (
              <>
                <Pause className="h-4 w-4 relative z-10" />
                {/* Pulsing rings effect when playing */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-white/50 pointer-events-none"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-white/30 pointer-events-none"
                  animate={{
                    scale: [1, 1.08, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.3
                  }}
                />
              </>
            ) : (
              <Play className="h-4 w-4" />
            )}
          </motion.button>
          
          {/* Smooth tooltip hint */}
          <AnimatePresence>
            {(showPlayHint || showFirstTimeAnimation) && !isPlayingAdhan && (
              <motion.div
                initial={{ opacity: 0, x: -5, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -5, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 text-white text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none z-[9999]"
                style={{
                  backgroundColor: showFirstTimeAnimation ? '#f97316' : '#2563eb'
                }}
              >
                <div className="flex items-center gap-1">
                  <Volume2 className="w-2.5 h-2.5 flex-shrink-0" />
                  <span className="font-medium">
                    {locale === 'ar' 
                      ? 'اضغط للاستماع للأذان' 
                      : 'Click to play adhan'
                    }
                  </span>
                </div>
                {/* Arrow pointing to button */}
                <div className="absolute top-1/2 right-full transform -translate-y-1/2">
                  <div 
                    className="w-0 h-0 border-t-[4px] border-b-[4px] border-r-[4px] border-transparent"
                    style={{
                      borderRightColor: showFirstTimeAnimation ? '#f97316' : '#2563eb'
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toast Notification for Play Adhan */}
          <AnimatePresence>
            {isPlayingAdhan && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="fixed top-20 right-6 z-[100] hidden md:block"
              >
                <div className="relative">
                  {/* Glow effect behind toast */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent-green/30 via-green-500/20 to-emerald-600/30 rounded-3xl blur-2xl pointer-events-none"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Toast container */}
                  <motion.div
                    className="relative flex items-center gap-4 px-5 py-4 bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border-2 border-accent-green/30 backdrop-blur-md"
                    animate={{
                      boxShadow: [
                        "0 20px 60px rgba(22, 163, 74, 0.3)",
                        "0 25px 70px rgba(22, 163, 74, 0.5)",
                        "0 20px 60px rgba(22, 163, 74, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Icon section */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-green to-green-600 shadow-lg">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Play className="w-6 h-6 text-white fill-white" />
                      </motion.div>
                    </div>
                    
                    {/* Content section */}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                        {locale === 'ar' ? 'الأذان يعمل الآن' : 'Adhan is Playing'}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {locale === 'ar' ? 'استمع إلى الأذان' : 'Listen to the call to prayer'}
                      </p>
                    </div>
                    
                    {/* Action button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        stopAdhan();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-accent-green to-green-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 relative z-10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Stop adhan"
                    >
                      <Pause className="w-4 h-4" />
                      <span>{locale === 'ar' ? 'إيقاف' : 'Stop'}</span>
                    </motion.button>
                    
                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-accent-green/50 pointer-events-none"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Language Toggle */}
        <LocaleSwitcher />

        {/* Desktop Navigation */}
        <Link href={'/reciters'} className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
              pathname?.includes('/reciters')
                ? 'bg-primary text-white border-primary'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
          >
            {t('reciters')}
          </motion.button>
        </Link>

      
          <Link href={'/prayer-times'} className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                pathname?.includes('/prayer-times')
                  ? 'bg-accent-green text-white border-accent-green'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('prayerTimes')}
            </motion.button>
          </Link>
   

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-surface-dark text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          aria-label="Menu"
        >
          <span className="material-symbols-outlined">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu-container md:hidden absolute top-full left-0 right-0 mt-2 mx-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden z-50"
          >
            <div className="flex flex-col p-4 gap-2">
              {/* Home */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`${buttonBaseClasses} ${
                  pathname === '/' || pathname?.includes('/page')
                    ? buttonActiveClasses
                    : buttonInactiveClasses
                }`}
              >
                <span className="material-symbols-outlined text-xl">home</span>
                <span>{t('logo')}</span>
              </Link>

              {/* Reciters */}
              <Link
                href="/reciters"
                onClick={() => setMobileMenuOpen(false)}
                className={`${buttonBaseClasses} ${
                  pathname?.includes('/reciters')
                    ? buttonActiveClasses
                    : buttonInactiveClasses
                }`}
              >
                <span className="material-symbols-outlined text-xl">record_voice_over</span>
                <span>{t('reciters')}</span>
              </Link>

              {/* Prayer Times - only if location enabled */}
              {hasLocation && (
                <Link
                  href="/prayer-times"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${buttonBaseClasses} ${
                    pathname?.includes('/prayer-times')
                      ? buttonActiveClasses
                      : buttonInactiveClasses
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">schedule</span>
                  <span>{t('prayerTimes')}</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
