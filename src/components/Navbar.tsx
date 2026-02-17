'use client';

import { Link, usePathname, useRouter } from '@/lib/intl';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import { Search } from 'lucide-react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useEffect, useState, useMemo, useRef } from 'react';
import { getNextPrayer, getTimeUntilNextPrayer, getPrayerTimesList } from '@/helpers/prayerTimes';
import { getReciters } from '@/api';
import { IReciter, RecitersResponse } from '@/types/Reciter';

interface INavbar { }

export default function Navbar({ }: INavbar) {
  const t = useTranslations('Navigation');
  const tPrayer = useTranslations('PrayerTimes');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { location, prayerTimes } = usePrayerTimes();
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string; timeUntil: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reciters, setReciters] = useState<IReciter[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if geolocation is supported and permission status
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        setIsLocationEnabled(result.state === 'granted' || result.state === 'prompt');
        result.onchange = () => {
          setIsLocationEnabled(result.state === 'granted' || result.state === 'prompt');
        };
      }).catch(() => {
        // If permissions API is not supported, assume location might be available
        setIsLocationEnabled(true);
      });
    } else {
      setIsLocationEnabled(false);
    }
  }, []);

  // Also check if we have location data
  const hasLocation = isLocationEnabled || location !== null;

  // Get next prayer info
  useEffect(() => {
    if (prayerTimes?.data?.timings) {
      const nextPrayerName = getNextPrayer(prayerTimes.data.timings);
      const timeUntil = getTimeUntilNextPrayer(prayerTimes.data.timings);
      setNextPrayerInfo({
        name: nextPrayerName,
        timeUntil: timeUntil,
      });

      // Update time every minute
      const interval = setInterval(() => {
        const updatedTimeUntil = getTimeUntilNextPrayer(prayerTimes.data.timings);
        setNextPrayerInfo(prev => prev ? { ...prev, timeUntil: updatedTimeUntil } : null);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('button[aria-label="Menu"]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch reciters on mount
  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const data = await getReciters<RecitersResponse>();
        if (data?.reciters) {
          setReciters(data.reciters);
        }
      } catch (error) {
        console.error('Failed to fetch reciters:', error);
      }
    };
    fetchReciters();
  }, []);

  // Filter reciters based on search query
  const filteredReciters = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return reciters.filter((reciter) =>
      reciter.name.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
  }, [searchQuery, reciters]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  // Handle reciter selection
  const handleReciterSelect = (reciterId: number) => {
    setSearchQuery('');
    setShowSearchResults(false);
    router.push(`/reciters/${reciterId}`);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.trim().length > 0);
  };

  // Handle Enter key press
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredReciters.length > 0) {
      handleReciterSelect(filteredReciters[0].id);
    }
  };

  const translations = {
    searchPlaceholder: locale === 'en' ? "Search Reciter..." : "ابحث عن قارئ...",
    nextPrayer: locale === 'en' ? "Next" : "القادم",
    inTime: locale === 'en' ? "in" : "خلال",
  };

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
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  pathname === '/' || pathname?.includes('/page')
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-xl">home</span>
                <span>{t('logo')}</span>
              </Link>

              {/* Reciters */}
              <Link
                href="/reciters"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  pathname?.includes('/reciters')
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    pathname?.includes('/prayer-times')
                      ? 'bg-accent-green text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
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
