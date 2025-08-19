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
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isOffline ? (
                        <WifiOff className="w-4 h-4 text-yellow-600" />
                    ) : (
                        <Wifi className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                        {isOffline ? t('offlineMode') : t('onlineMode')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {cacheStatus.hasCache && (
                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                            <Database className="w-3 h-3" />
                            <span>
                                {t('lastUpdated')}: {cacheStatus.lastUpdated}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <button
                            onClick={onRefresh}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                            title={t('refresh')}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>

                        {cacheStatus.hasCache && (
                            <button
                                onClick={onClearCache}
                                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                                title={t('clearCache')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {cacheStatus.isExpired && (
                <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{t('cachedDataOutdated')}</span>
                </div>
            )}
        </motion.div>
    );
} 