'use client';

import { motion } from 'framer-motion';
import { PrayerTimes } from '@/types/PrayerTimes';
import { getNextPrayer, getTimeUntilNextPrayer, getPrayerNameInArabic } from '@/helpers/prayerTimes';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface NextPrayerCardProps {
  prayerTimes: PrayerTimes;
  locale: string;
}

export default function NextPrayerCard({ prayerTimes, locale }: NextPrayerCardProps) {
  const t = useTranslations('PrayerTimes');
  const [timeUntil, setTimeUntil] = useState('');
  const isArabic = locale === 'ar';

  const nextPrayerName = getNextPrayer(prayerTimes);
  const arabicPrayerName = getPrayerNameInArabic(nextPrayerName);

  useEffect(() => {
    const updateTime = () => {
      setTimeUntil(getTimeUntilNextPrayer(prayerTimes));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  const prayerIcons: Record<string, string> = {
    Fajr: '🌅',
    Sunrise: '☀️',
    Dhuhr: '🌞',
    Asr: '🌤️',
    Maghrib: '🌆',
    Isha: '🌙',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-accent-green to-green-600 dark:from-accent-green dark:to-green-700 rounded-3xl p-6 text-white shadow-lg shadow-accent-green/20 transition-all duration-500"
    >
      <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="text-4xl">{prayerIcons[nextPrayerName]}</div>
          <div className={`text-left ${isArabic ? 'text-right' : 'text-left'}`}>
            <h2 className="text-lg font-medium opacity-90">
              {t('nextPrayer')}
            </h2>
            <h3 className="text-2xl font-bold mt-1">
              {t(`prayers.${nextPrayerName.toLowerCase()}`)}
            </h3>
          </div>
        </div>

        <div className={`text-right ${isArabic ? 'text-left' : 'text-right'}`}>
          <p className="text-sm opacity-90">
            {t('timeUntil')}
          </p>
          <p className="text-3xl font-bold mt-1">
            {timeUntil}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-sm opacity-90">
          {t('prayerTimesForLocation')}
        </p>
      </div>
    </motion.div>
  );
} 