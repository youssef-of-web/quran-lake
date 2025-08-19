import { PrayerTimesResponse, Location } from '@/types/PrayerTimes';

interface CachedPrayerData {
    prayerTimes: PrayerTimesResponse;
    location: Location;
    timestamp: number;
    date: string;
}

interface CacheConfig {
    maxAge: number;
    key: string;
}

class PrayerTimesCache {
    private readonly config: CacheConfig = {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        key: 'quran-lake-prayer-times-cache'
    };

    /**
     * Check if the browser supports localStorage
     */
    private isStorageSupported(): boolean {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get cached prayer times data
     */
    getCachedData(): CachedPrayerData | null {
        if (!this.isStorageSupported()) {
            return null;
        }

        try {
            const cached = localStorage.getItem(this.config.key);
            if (!cached) {
                return null;
            }

            const data: CachedPrayerData = JSON.parse(cached);
            const now = Date.now();
            const isExpired = now - data.timestamp > this.config.maxAge;

            if (isExpired) {
                this.clearCache();
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error reading from cache:', error);
            this.clearCache();
            return null;
        }
    }

    /**
     * Cache prayer times data
     */
    setCachedData(prayerTimes: PrayerTimesResponse, location: Location): void {
        if (!this.isStorageSupported()) {
            return;
        }

        try {
            const data: CachedPrayerData = {
                prayerTimes,
                location,
                timestamp: Date.now(),
                date: new Date().toISOString().split('T')[0]
            };

            localStorage.setItem(this.config.key, JSON.stringify(data));
        } catch (error) {
            console.error('Error writing to cache:', error);
            // If storage is full, try to clear old data and retry
            this.clearCache();
            try {
                const data: CachedPrayerData = {
                    prayerTimes,
                    location,
                    timestamp: Date.now(),
                    date: new Date().toISOString().split('T')[0]
                };
                localStorage.setItem(this.config.key, JSON.stringify(data));
            } catch (retryError) {
                console.error('Failed to write to cache after clearing:', retryError);
            }
        }
    }

    /**
     * Clear the cache
     */
    clearCache(): void {
        if (this.isStorageSupported()) {
            try {
                localStorage.removeItem(this.config.key);
            } catch (error) {
                console.error('Error clearing cache:', error);
            }
        }
    }

    /**
     * Check if we have valid cached data for today
     */
    hasValidCacheForToday(): boolean {
        const cached = this.getCachedData();
        if (!cached) {
            return false;
        }

        const today = new Date().toISOString().split('T')[0];
        return cached.date === today;
    }

    /**
     * Get cache status information
     */
    getCacheStatus(): {
        hasCache: boolean;
        isExpired: boolean;
        isForToday: boolean;
        lastUpdated: string | null;
    } {
        const cached = this.getCachedData();
        if (!cached) {
            return {
                hasCache: false,
                isExpired: false,
                isForToday: false,
                lastUpdated: null
            };
        }

        const now = Date.now();
        const isExpired = now - cached.timestamp > this.config.maxAge;
        const today = new Date().toISOString().split('T')[0];
        const isForToday = cached.date === today;

        return {
            hasCache: true,
            isExpired,
            isForToday,
            lastUpdated: new Date(cached.timestamp).toLocaleString()
        };
    }

    /**
     * Check if we're online
     */
    isOnline(): boolean {
        return typeof navigator !== 'undefined' && navigator.onLine;
    }

    /**
     * Get cache size in bytes
     */
    getCacheSize(): number {
        if (!this.isStorageSupported()) {
            return 0;
        }

        try {
            const cached = localStorage.getItem(this.config.key);
            return cached ? new Blob([cached]).size : 0;
        } catch {
            return 0;
        }
    }
}

// Export a singleton instance
export const prayerTimesCache = new PrayerTimesCache(); 