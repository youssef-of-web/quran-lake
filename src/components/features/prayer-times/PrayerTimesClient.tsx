'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPrayerTimesList, getCurrentDateFormatted, getCountdownToNextPrayer, getNextPrayer } from '@/helpers/prayerTimes';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function PrayerTimesClient() {
    const t = useTranslations('PrayerTimes');
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const isArabic = locale === 'ar';

    const {
        prayerTimes,
        location,
        loading,
        error,
        refreshing,
        isOffline,
        cacheStatus,
        refresh,
        clearCache,
    } = usePrayerTimes();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            if (prayerTimes?.data.timings) {
                setCountdown(getCountdownToNextPrayer(prayerTimes.data.timings));
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [prayerTimes]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const prayerIcons: Record<string, string> = {
        Fajr: 'wb_twilight',
        Sunrise: 'light_mode',
        Dhuhr: 'light_mode',
        Asr: 'wb_sunny',
        Maghrib: 'bedtime',
        Isha: 'dark_mode',
    };

    if (loading && !prayerTimes) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isArabic ? 'rtl' : 'ltr'}`}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center max-w-md"
                >
                    <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {t('loading')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        {isArabic ? 'يرجى السماح بالوصول إلى الموقع' : 'Please allow location access'}
                    </p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center px-4 ${isArabic ? 'rtl' : 'ltr'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t('error')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                        {error}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={refresh}
                            className="w-full bg-accent-green text-white px-4 py-2 rounded-2xl hover:bg-green-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                        >
                            {t('refresh')}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!prayerTimes || !location) {
        return (
            <div className={`min-h-screen bg-slate-50 dark:bg-background-dark ${isArabic ? 'rtl' : 'ltr'}`}>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-center mb-8 ${isArabic ? 'text-right' : 'text-left'}`}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                            {t('subtitle')}
                        </p>
                        <button
                            onClick={refresh}
                            className="bg-accent-green text-white px-6 py-3 rounded-2xl hover:bg-green-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                        >
                            {t('refresh')}
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const prayerTimesList = getPrayerTimesList(prayerTimes.data.timings, locale);
    const nextPrayerName = getNextPrayer(prayerTimes.data.timings);
    const locationText = location.city && location.country 
        ? `${location.city}, ${location.country}` 
        : `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-background-dark ${isArabic ? 'rtl' : 'ltr'}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header with Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-all"
                    >
                        <span className="material-symbols-outlined rotate-0 rtl:rotate-180">arrow_back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-black text-slate-900 dark:text-white">{t('title')}</h1>
                        <p className="text-xs font-bold text-accent-green uppercase tracking-[0.2em]">{locationText}</p>
                    </div>
                    <div className="w-12"></div> {/* Spacer for symmetry */}
                </div>

                {/* Hero: Current Time & Next Prayer Countdown */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary via-primary-light to-blue-900 dark:to-black p-10 lg:p-14 text-white shadow-2xl mb-12">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-[12rem] rotate-12">schedule</span>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-2 text-center md:text-left rtl:md:text-right">
                            <p className="text-blue-100/60 font-bold uppercase tracking-widest text-xs">{formatDate(currentTime)}</p>
                            <h2 className="text-6xl lg:text-7xl font-black tracking-tighter tabular-nums drop-shadow-md">
                                {formatTime(currentTime).split(' ')[0]}
                                <span className="text-2xl font-medium ml-2 opacity-50">{formatTime(currentTime).split(' ')[1]}</span>
                            </h2>
                            <p className="text-blue-100/80 font-medium italic">{prayerTimes.data.date.hijri.date} ({t('hijri')})</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center gap-4 min-w-[240px] shadow-inner">
                            <div className="text-center">
                                <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('nextPrayer')}</p>
                                <h3 className="text-3xl font-black text-white">{t(`prayers.${nextPrayerName.toLowerCase()}`)}</h3>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="text-center">
                                    <span className="block text-2xl font-black">{String(countdown.hours).padStart(2, '0')}</span>
                                    <span className="text-[10px] opacity-50 font-bold uppercase">{locale === 'en' ? 'hrs' : 'س'}</span>
                                </div>
                                <span className="text-2xl font-light opacity-30">:</span>
                                <div className="text-center">
                                    <span className="block text-2xl font-black">{String(countdown.minutes).padStart(2, '0')}</span>
                                    <span className="text-[10px] opacity-50 font-bold uppercase">{locale === 'en' ? 'min' : 'د'}</span>
                                </div>
                                <span className="text-2xl font-light opacity-30">:</span>
                                <div className="text-center">
                                    <span className="block text-2xl font-black">{String(countdown.seconds).padStart(2, '0')}</span>
                                    <span className="text-[10px] opacity-50 font-bold uppercase">{locale === 'en' ? 'sec' : 'ث'}</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-accent-green w-2/3 shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prayer List - Modern Timeline Style */}
                <div className="space-y-4">
                    {prayerTimesList.map((prayer, index) => {
                        const isNext = prayer.isNext;
                        const nextPrayerIndex = prayerTimesList.findIndex(p => p.isNext);
                        const isPassed = index < nextPrayerIndex;
                        const isCurrent = prayer.isCurrent;

                        return (
                            <div
                                key={prayer.name}
                                className={`
                                    group relative flex items-center gap-6 p-6 lg:p-8 rounded-[2rem] transition-all duration-500
                                    ${isArabic ? 'flex-row-reverse' : ''}
                                    ${isNext
                                        ? 'bg-white dark:bg-surface-dark border-2 border-accent-green shadow-xl scale-[1.02] z-10'
                                        : isPassed
                                            ? 'bg-slate-100/50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 opacity-60'
                                            : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-slate-600'}
                                `}
                            >
                                {/* Icon Section */}
                                <div className={`
                                    flex size-16 items-center justify-center rounded-2xl transition-all duration-500
                                    ${isNext
                                        ? 'bg-accent-green text-white shadow-lg shadow-accent-green/20 scale-110'
                                        : isPassed
                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary group-hover:text-white'}
                                `}>
                                    <span className="material-symbols-outlined text-3xl">{prayerIcons[prayer.name] || 'schedule'}</span>
                                </div>

                                {/* Name & Label */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className={`text-xl font-black ${isNext ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {t(`prayers.${prayer.name.toLowerCase()}`)}
                                        </h4>
                                        {isNext && (
                                            <span className="bg-accent-green/10 text-accent-green text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-accent-green/20">
                                                {t('statusUpcoming')}
                                            </span>
                                        )}
                                        {isCurrent && !isNext && (
                                            <span className="bg-primary/10 text-primary dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20">
                                                {t('statusCurrent')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                                        {isPassed ? t('statusPassed') : isNext ? `${t('countdown')} ${countdown.hours}h ${countdown.minutes}m` : ''}
                                    </p>
                                </div>

                                {/* Time Section */}
                                <div className={isArabic ? 'text-left' : 'text-right'}>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-3xl font-black tabular-nums ${isNext ? 'text-accent-green' : 'text-slate-800 dark:text-slate-100'}`}>
                                            {prayer.time.split(' ')[0]}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 uppercase">{prayer.time.split(' ')[1]}</span>
                                    </div>
                                </div>

                                {/* Decorative line for timeline */}
                                {index < prayerTimesList.length - 1 && (
                                    <div className={`absolute bottom-[-1rem] ${isArabic ? 'right-14' : 'left-14'} w-0.5 h-4 bg-slate-200 dark:bg-slate-800`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Motivational Quote Footer */}
                <div className="mt-16 text-center px-8">
                    <p className="text-slate-400 italic text-sm leading-relaxed max-w-lg mx-auto">
                        "{t('quote')}"
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button className="p-3 rounded-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">location_on</span>
                        </button>
                        <button className="p-3 rounded-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">settings</span>
                        </button>
                        <button className="p-3 rounded-full bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-xl">share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
