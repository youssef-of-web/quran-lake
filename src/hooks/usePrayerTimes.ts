import { useState, useEffect, useCallback } from 'react';
import { PrayerTimesResponse, Location } from '@/types/PrayerTimes';
import { getPrayerTimes, getLocationFromCoords } from '@/api';
import { prayerTimesCache } from '@/lib/cache';

interface UsePrayerTimesReturn {
    prayerTimes: PrayerTimesResponse | null;
    location: Location | null;
    loading: boolean;
    error: string | null;
    refreshing: boolean;
    isOffline: boolean;
    cacheStatus: {
        hasCache: boolean;
        isExpired: boolean;
        isForToday: boolean;
        lastUpdated: string | null;
    };
    refresh: () => Promise<void>;
    clearCache: () => void;
}

export const usePrayerTimes = (): UsePrayerTimesReturn => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResponse | null>(null);
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isOffline, setIsOffline] = useState(!prayerTimesCache.isOnline());

    // Check online status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Get cache status
    const cacheStatus = prayerTimesCache.getCacheStatus();



    // Get current location
    const getCurrentLocation = useCallback((): Promise<Location> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            const timeoutId = setTimeout(() => {
                reject(new Error('Location request timed out'));
            }, 20000);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    clearTimeout(timeoutId);
                    const { latitude, longitude } = position.coords;

                    if (isNaN(latitude) || isNaN(longitude) ||
                        latitude < -90 || latitude > 90 ||
                        longitude < -180 || longitude > 180) {
                        reject(new Error('Invalid coordinates received'));
                        return;
                    }

                    try {
                        const locationInfo = await getLocationFromCoords(latitude, longitude);
                        resolve({
                            latitude,
                            longitude,
                            city: locationInfo?.city,
                            country: locationInfo?.country,
                        });
                    } catch (error) {
                        resolve({
                            latitude,
                            longitude,
                        });
                    }
                },
                (error) => {
                    clearTimeout(timeoutId);
                    let errorMessage = 'Unable to retrieve your location';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable. Please check your internet connection.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out. Please try again.';
                            break;
                        default:
                            errorMessage = 'Unable to retrieve your location. Please try again.';
                    }

                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 300000,
                }
            );
        });
    }, []);

    // Fetch prayer times
    const fetchPrayerTimes = useCallback(async (userLocation: Location, isRefresh = false) => {
        try {
            const data = await getPrayerTimes(userLocation.latitude, userLocation.longitude);
            if (data && data.data && data.data.timings) {
                setPrayerTimes(data);
                setLocation(userLocation);
                setError(null);

                // Cache the data
                prayerTimesCache.setCachedData(data, userLocation);
                console.log('Prayer times cached successfully');

                return data;
            } else {
                throw new Error('Invalid prayer times data received');
            }
        } catch (err) {
            console.error('Prayer times fetch error:', err);

            // If this is a refresh and we have cached data, don't show error
            if (isRefresh && prayerTimesCache.hasValidCacheForToday()) {
                console.log('Using cached data due to fetch error');
                return null;
            }

            throw new Error('Failed to fetch prayer times. Please check your internet connection.');
        }
    }, []);

    // Main function to get location and prayer times
    const getLocationAndPrayerTimes = useCallback(async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
                setError(null);
            } else {
                setRefreshing(true);
            }

            // Check if we're offline and have cached data
            if (isOffline && prayerTimesCache.hasValidCacheForToday()) {
                const cached = prayerTimesCache.getCachedData();
                if (cached) {
                    setPrayerTimes(cached.prayerTimes);
                    setLocation(cached.location);
                    setError(null);
                    console.log('Using cached data (offline mode)');
                    return;
                }
            }

            // If offline and no cache, show error
            if (isOffline && !prayerTimesCache.hasValidCacheForToday()) {
                throw new Error('No internet connection and no cached data available. Please connect to the internet to load prayer times.');
            }

            const userLocation = await getCurrentLocation();
            await fetchPrayerTimes(userLocation, isRefresh);
        } catch (err) {
            console.error('Location error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unable to get your location';

            // If we have cached data, use it instead of showing error
            if (prayerTimesCache.hasValidCacheForToday()) {
                const cached = prayerTimesCache.getCachedData();
                if (cached) {
                    setPrayerTimes(cached.prayerTimes);
                    setLocation(cached.location);
                    // More specific error message based on error type
                    if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
                        setError('Location permission denied. Using cached data. Click the location button to request permission.');
                    } else if (errorMessage.includes('timeout')) {
                        setError('Location request timed out. Using cached data. Click the location button to try again.');
                    } else {
                        setError('Unable to access location. Using cached data. Click the location button to request permission.');
                    }
                    console.log('Using cached data due to location error:', errorMessage);
                    return;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isOffline, getCurrentLocation, fetchPrayerTimes]);

    // Refresh function
    const refresh = useCallback(async () => {
        await getLocationAndPrayerTimes(true);
    }, [getLocationAndPrayerTimes]);

    // Clear cache function
    const clearCache = useCallback(() => {
        prayerTimesCache.clearCache();
        setPrayerTimes(null);
        setLocation(null);
        setError(null);
        console.log('Cache cleared');
    }, []);

    // Auto-refresh when coming back online
    useEffect(() => {
        if (!isOffline && prayerTimesCache.hasValidCacheForToday()) {
            refresh();
        }
    }, [isOffline, refresh]);

    // Initial load
    useEffect(() => {
        const loadInitialData = async () => {
            // If we have cached data, load it first
            const cached = prayerTimesCache.getCachedData();
            if (cached) {
                setPrayerTimes(cached.prayerTimes);
                setLocation(cached.location);
                setError(null);
                setLoading(false);
                console.log('Loaded prayer times from cache on initial load');
            }

            // If we're online, try to get fresh data
            if (prayerTimesCache.isOnline()) {
                try {
                    await getLocationAndPrayerTimes();
                } catch (error) {
                    console.error('Failed to load fresh data:', error);
                    // If we don't have cached data, show error
                    if (!cached) {
                        setError('Failed to load prayer times. Please check your internet connection.');
                        setLoading(false);
                    }
                }
            } else if (!cached) {
                // If offline and no cache, show error
                setError('No internet connection and no cached data available. Please connect to the internet to load prayer times.');
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    return {
        prayerTimes,
        location,
        loading,
        error,
        refreshing,
        isOffline,
        cacheStatus,
        refresh,
        clearCache,
    };
}; 