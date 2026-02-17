'use client';

import { motion } from 'framer-motion';
import { Location } from '@/types/PrayerTimes';
import { useTranslations } from 'next-intl';
import { MapPin, RefreshCw } from 'lucide-react';

interface LocationCardProps {
  location: Location;
  locale: string;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function LocationCard({ location, locale, onRefresh, isLoading }: LocationCardProps) {
  const t = useTranslations('PrayerTimes');
  const isArabic = locale === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      dir={'ltr'}
      className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500"
    >
      <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors duration-300">
            <MapPin className="w-5 h-5 text-accent-green dark:text-accent-green" />
          </div>
          <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              {t('location')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {location.city && location.country
                ? `${location.city}, ${location.country}`
                : t('currentLocation')
              }
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-mono">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`p-3 rounded-2xl transition-all duration-300 ${isLoading
            ? 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 active:scale-95'
            }`}
          aria-label={t('refresh')}
        >
          <RefreshCw
            className={`w-5 h-5 text-accent-green dark:text-accent-green ${isLoading ? 'animate-spin' : ''
              }`}
          />
        </button>
      </div>
    </motion.div>
  );
} 