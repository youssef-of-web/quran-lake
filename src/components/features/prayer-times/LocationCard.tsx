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
      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {t('location')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {location.city && location.country
                ? `${location.city}, ${location.country}`
                : t('currentLocation')
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-colors ${isLoading
            ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
            : 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
          aria-label={t('refresh')}
        >
          <RefreshCw
            className={`w-4 h-4 text-green-600 dark:text-green-400 ${isLoading ? 'animate-spin' : ''
              }`}
          />
        </button>
      </div>
    </motion.div>
  );
} 