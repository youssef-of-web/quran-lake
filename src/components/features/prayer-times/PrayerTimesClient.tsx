'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPrayerTimesList, getCurrentDateFormatted } from '@/helpers/prayerTimes';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import NextPrayerCard from './NextPrayerCard';
import LocationCard from './LocationCard';
import PrayerTimesCard from './PrayerTimesCard';
import AdhanPlayer from './AdhanPlayer';
import CacheStatus from './CacheStatus';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function PrayerTimesClient() {
    const t = useTranslations('PrayerTimes');
    const params = useParams();
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
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
            <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 ${isArabic ? 'rtl' : 'ltr'}`}>
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
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                            {t('refresh')}
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    const prayerTimesList = getPrayerTimesList(prayerTimes.data.timings);

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 ${isArabic ? 'rtl' : 'ltr'}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center mb-8 ${isArabic ? 'text-right' : 'text-left'}`}
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                        {t('subtitle')}
                    </p>
                </motion.div>

                <div className="space-y-4 sm:space-y-6">
                    {/* Cache Status */}
                    <CacheStatus
                        isOffline={isOffline}
                        cacheStatus={cacheStatus}
                        onRefresh={refresh}
                        onClearCache={clearCache}
                    />

                    {/* Next Prayer Card */}
                    <NextPrayerCard prayerTimes={prayerTimes.data.timings} locale={locale} />

                    {/* Location Card */}
                    <LocationCard
                        location={location}
                        locale={locale}
                        onRefresh={refresh}
                        isLoading={refreshing}
                    />

                    {/* Prayer Times Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        dir={'ltr'}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
                    >
                        {prayerTimesList.map((prayer) => (
                            <PrayerTimesCard
                                key={prayer.name}
                                prayer={prayer}
                                locale={locale}
                            />
                        ))}
                    </motion.div>

                    {/* Date Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 text-center"
                    >
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            {t('today')}: {getCurrentDateFormatted(locale)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                            {prayerTimes.data.date.hijri.date} ({t('hijri')})
                        </p>
                    </motion.div>
                </div>

                {/* Adhan Player */}
                <AdhanPlayer prayerTimes={prayerTimes.data.timings} locale={locale} />
            </div>
        </div>
    );
} 
