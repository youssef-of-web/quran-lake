'use client';

import { motion } from 'framer-motion';
import { PrayerTime } from '@/types/PrayerTimes';
import { useTranslations } from 'next-intl';
import { getPrayerNameInArabic } from '@/helpers/prayerTimes';

interface PrayerTimesCardProps {
    prayer: PrayerTime;
    locale: string;
}

export default function PrayerTimesCard({ prayer, locale }: PrayerTimesCardProps) {
    const t = useTranslations('PrayerTimes');
    const isArabic = locale === 'ar';

    const prayerIcons: Record<string, string> = {
        fajr: 'wb_twilight',
        sunrise: 'light_mode',
        dhuhr: 'light_mode',
        asr: 'wb_sunny',
        maghrib: 'bedtime',
        isha: 'dark_mode',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={prayer.isNext || prayer.isCurrent ? {} : { y: -8 }}
            className={`group relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-primary-light/50 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 cursor-pointer overflow-hidden shadow-sm ${
                prayer.isNext 
                    ? 'border-2 border-accent-green/40 bg-gradient-to-br from-primary/10 to-slate-100 dark:from-primary/30 dark:to-surface-dark' 
                    : ''
            }`}
        >
            {prayer.isNext && (
                <div className={`absolute top-6 ${isArabic ? 'left-6' : 'right-6'} flex items-center gap-2`}>
                    <span className="text-[10px] font-bold text-accent-green tracking-widest uppercase">{t('nextPrayer')}</span>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                    </span>
                </div>
            )}

            <div className="flex items-start gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-background-dark text-slate-400 dark:text-slate-500 font-mono text-lg font-black border border-slate-200 dark:border-slate-800 group-hover:border-primary-light transition-colors">
                    <span className="material-symbols-outlined text-2xl">{prayerIcons[prayer.name.toLowerCase()] || 'schedule'}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                        {t(`prayers.${prayer.name.toLowerCase()}`)}
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        {prayer.name}
                    </p>
                </div>
            </div>

            <div className="mt-8 flex items-end justify-between">
                <div className="flex flex-col gap-1 text-left rtl:text-right">
                    {prayer.isNext && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                            {t('nextPrayer')}
                        </span>
                    )}
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full">
                        {prayer.time}
                    </span>
                </div>
                <span className="arabic-text text-3xl text-slate-600 dark:text-slate-300 group-hover:text-primary dark:group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    {getPrayerNameInArabic(prayer.name)}
                </span>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.div>
    );
} 