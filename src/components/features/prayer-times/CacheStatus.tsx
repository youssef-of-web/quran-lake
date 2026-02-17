'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Wifi, WifiOff, Database, RefreshCw, Trash2 } from 'lucide-react';

interface CacheStatusProps {
    isOffline: boolean;
    cacheStatus: {
        hasCache: boolean;
        isExpired: boolean;
        isForToday: boolean;
        lastUpdated: string | null;
    };
    onRefresh: () => void;
    onClearCache: () => void;
    locale: string;
}

export default function CacheStatus({
    isOffline,
    cacheStatus,
    onRefresh,
    onClearCache,
    locale
}: CacheStatusProps) {
    const t = useTranslations('PrayerTimes.cache');
    const isArabic = locale === 'ar';

    if (!isOffline && !cacheStatus.hasCache) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 transition-all duration-500"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isOffline ? (
                        <WifiOff className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                        <Wifi className="w-4 h-4 text-accent-green dark:text-accent-green" />
                    )}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {isOffline ? t('offlineMode') : t('onlineMode')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {cacheStatus.hasCache && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <Database className="w-3 h-3" />
                            <span>
                                {t('lastUpdated')}: {cacheStatus.lastUpdated}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-all duration-300 hover:scale-105 active:scale-95"
                            title={t('refresh')}
                            aria-label={t('refresh')}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>

                        {cacheStatus.hasCache && (
                            <button
                                onClick={onClearCache}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 hover:scale-105 active:scale-95"
                                title={t('clearCache')}
                                aria-label={t('clearCache')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {cacheStatus.isExpired && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <span className="font-medium">{t('cachedDataOutdated')}</span>
                </div>
            )}
        </motion.div>
    );
} 