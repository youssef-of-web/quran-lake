'use client';

import { motion } from 'framer-motion';
import { PrayerTime } from '@/types/PrayerTimes';
import { useTranslations } from 'next-intl';

interface PrayerTimesCardProps {
    prayer: PrayerTime;
    locale: string;
}

export default function PrayerTimesCard({ prayer, locale }: PrayerTimesCardProps) {
    const t = useTranslations('PrayerTimes');
    const isArabic = locale === 'ar';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`relative p-5 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md ${prayer.isCurrent
                ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700'
                : prayer.isNext
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
        >
            {/* Status indicators */}
            {prayer.isCurrent && (
                <div className={`absolute -top-2 w-4 h-4 bg-green-500 rounded-full animate-pulse ${isArabic ? '-left-2' : '-right-2'}`} />
            )}
            {prayer.isNext && (
                <div className={`absolute -top-2 w-4 h-4 bg-blue-500 rounded-full animate-pulse ${isArabic ? '-left-2' : '-right-2'}`} />
            )}

            {/* Header with prayer name and icon */}
            <div className={`flex items-center gap-3 mb-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-3xl">{prayer.icon}</span>
                <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <h3 className={`text-lg font-bold text-gray-900 dark:text-white ${prayer.isCurrent ? 'text-green-700 dark:text-green-400' :
                        prayer.isNext ? 'text-blue-700 dark:text-blue-400' : ''
                        }`}>
                        {t(`prayers.${prayer.name.toLowerCase()}`)}
                    </h3>
                    {prayer.isCurrent && (
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                            {t('currentPrayer')}
                        </p>
                    )}
                    {prayer.isNext && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                            {t('nextPrayer')}
                        </p>
                    )}
                </div>
            </div>

            {/* Times section */}
            <div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
                {/* Prayer Time */}
                <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('prayerTime')}
                    </span>
                    <span className={`text-xl font-bold ${prayer.isCurrent ? 'text-green-700 dark:text-green-400' :
                        prayer.isNext ? 'text-blue-700 dark:text-blue-400' :
                            'text-gray-900 dark:text-white'
                        }`}>
                        {prayer.time}
                    </span>
                </div>

                {/* Adhan Time */}
                <div className="flex items-center justify-between p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {prayer.adhanTime && prayer.adhanTime !== prayer.time ? t('adhanTime') : t('adhan')}
                    </span>
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {prayer.adhanTime && prayer.adhanTime !== prayer.time
                            ? prayer.adhanTime
                            : t('adhanReminder')
                        }
                    </span>
                </div>
            </div>
        </motion.div>
    );
} 