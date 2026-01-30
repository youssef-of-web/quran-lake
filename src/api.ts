import { getLocalForApi } from "./helpers/utils";
import { axiosInstance } from "./lib/axios";
import { BaseApiError } from "./types/ApiError";
import { PrayerTimesResponse } from "./types/PrayerTimes";
import type { AxiosRequestConfig } from "axios";

const handleErrors = async (res: unknown) => {
  return res;
};

const fetcher = async <T>(url: string, options?: AxiosRequestConfig): Promise<T> => {
  const response = await axiosInstance.get(url, options);
  return response.data as T;
};

const getSurahListUrl = async () => {
  const locale = await getLocalForApi();
  return `suwar?language=${locale}`;
};

const getRecitersUrl = async () => {
  const locale = await getLocalForApi();
  return `reciters?language=${locale}`;
};

const getReciterByIdUrl = async (id: number) => {
  const locale = await getLocalForApi();
  return `reciters?language=${locale}&reciter=${id}`;
};

const getSurahList = async <T>() => {
  try {
    const response = await fetcher<T>(await getSurahListUrl());
    return response;
  } catch (error) {
    await handleErrors(error as BaseApiError);
    return null;
  }
};

const getReciters = async <T>() => {
  try {
    const data = await fetcher<T>(await getRecitersUrl());
    return data;
  } catch (error) {
    await handleErrors(error as BaseApiError);
    return null;
  }
};

const getReciterById = async <T>(id: number) => {
  try {
    const data = await fetcher<T>(await getReciterByIdUrl(id));
    return data;
  } catch (error) {
    await handleErrors(error as BaseApiError);
    return null;
  }
};


const getPrayerTimesUrl = (latitude: number, longitude: number, date?: string) => {
  const today = date || new Date().toISOString().split('T')[0];
  // Using method 4 (Umm Al-Qura University, Makkah) which provides more accurate adhan times
  return `http://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=4&school=1&adjustment=1`;
};

const getLocationFromCoordsUrl = (latitude: number, longitude: number) => {
  return `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
};

// Alternative API for adhan times - using Islamic Network API
const getAdhanTimesUrl = (latitude: number, longitude: number, date?: string) => {
  const today = date || new Date().toISOString().split('T')[0];
  return `https://api.aladhan.com/v1/timingsByCity/${today}?city=&country=&latitude=${latitude}&longitude=${longitude}&method=4`;
};

// Enhanced prayer times URL with multiple calculation methods
const getEnhancedPrayerTimesUrl = (latitude: number, longitude: number, date?: string) => {
  const today = date || new Date().toISOString().split('T')[0];
  return `https://api.aladhan.com/v1/timings/${today}?latitude=${latitude}&longitude=${longitude}&method=4&school=1&adjustment=1&latitudeAdjustmentMethod=3&midnightMode=1`;
};


const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      console.warn(`API call attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error('API call failed');
};

const getPrayerTimes = async (latitude: number, longitude: number, date?: string): Promise<PrayerTimesResponse | null> => {
  try {
    if (isNaN(latitude) || isNaN(longitude) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180) {
      throw new Error('Invalid coordinates provided');
    }

    const response = await retryApiCall(async () => {
      let result;
      try {
        result = await axiosInstance.get(getEnhancedPrayerTimesUrl(latitude, longitude, date));
      } catch {
        // Fallback to basic URL if enhanced fails
        result = await axiosInstance.get(getPrayerTimesUrl(latitude, longitude, date));
      }

      if (!result.data || !result.data.data || !result.data.data.timings) {
        throw new Error('Invalid prayer times response structure');
      }

      return result;
    });

    return response.data;
  } catch (error) {
    console.error('Prayer times API error:', error);
    await handleErrors(error as BaseApiError);
    return null;
  }
};

const getLocationFromCoords = async (latitude: number, longitude: number): Promise<{ city: string; country: string } | null> => {
  try {
    if (isNaN(latitude) || isNaN(longitude) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180) {
      throw new Error('Invalid coordinates provided');
    }

    const response = await retryApiCall(async () => {
      return await axiosInstance.get(getLocationFromCoordsUrl(latitude, longitude));
    });

    return {
      city: response.data.city || response.data.locality || 'Unknown City',
      country: response.data.countryName || 'Unknown Country',
    };
  } catch (error) {
    console.error('Location API error:', error);
    await handleErrors(error as BaseApiError);
    return null;
  }
};

// Get adhan times from trusted API
const getAdhanTimes = async (latitude: number, longitude: number, date?: string): Promise<PrayerTimesResponse | null> => {
  try {
    if (isNaN(latitude) || isNaN(longitude) ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180) {
      throw new Error('Invalid coordinates provided');
    }

    const response = await retryApiCall(async () => {
      const result = await axiosInstance.get(getAdhanTimesUrl(latitude, longitude, date));

      if (!result.data || !result.data.data || !result.data.data.timings) {
        throw new Error('Invalid adhan times response structure');
      }

      return result;
    });

    return response.data;
  } catch (error) {
    console.error('Adhan times API error:', error);
    await handleErrors(error as BaseApiError);
    return null;
  }
};

export { getReciterById, getReciters, getSurahList, getPrayerTimes, getLocationFromCoords, getAdhanTimes };
