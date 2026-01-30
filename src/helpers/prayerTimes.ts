import { format, parseISO, isAfter, isBefore, addMinutes } from 'date-fns';
import { PrayerTimes, PrayerTime } from '@/types/PrayerTimes';

export const formatPrayerTime = (timeString: string): string => {
  try {
    const time = parseISO(`2000-01-01T${timeString}`);
    return format(time, 'h:mm a');
  } catch {
    return timeString;
  }
};

export const getCurrentPrayer = (prayerTimes: PrayerTimes): string | null => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (let i = 0; i < prayerOrder.length; i++) {
    const currentPrayer = prayerOrder[i];
    const nextPrayer = prayerOrder[i + 1];

    const currentTime = parseISO(`${today}T${prayerTimes[currentPrayer as keyof PrayerTimes]}`);
    const nextTime = nextPrayer
      ? parseISO(`${today}T${prayerTimes[nextPrayer as keyof PrayerTimes]}`)
      : parseISO(`${today}T${prayerTimes.Fajr}`); // Next day's Fajr

    if (isAfter(now, currentTime) && isBefore(now, nextTime)) {
      return currentPrayer;
    }
  }

  return null;
};

export const getNextPrayer = (prayerTimes: PrayerTimes): string => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const prayer of prayerOrder) {
    const prayerTime = parseISO(`${today}T${prayerTimes[prayer as keyof PrayerTimes]}`);
    if (isAfter(prayerTime, now)) {
      return prayer;
    }
  }

  // If no prayer is found for today, return tomorrow's Fajr
  return 'Fajr';
};

export const getTimeUntilNextPrayer = (prayerTimes: PrayerTimes): string => {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  const nextPrayerName = getNextPrayer(prayerTimes);

  let nextPrayerTime: Date;
  if (nextPrayerName === 'Fajr' && isAfter(now, parseISO(`${today}T${prayerTimes.Isha}`))) {
    // Next prayer is tomorrow's Fajr
    const tomorrow = format(addMinutes(now, 24 * 60), 'yyyy-MM-dd');
    nextPrayerTime = parseISO(`${tomorrow}T${prayerTimes.Fajr}`);
  } else {
    nextPrayerTime = parseISO(`${today}T${prayerTimes[nextPrayerName as keyof PrayerTimes]}`);
  }

  const diffMs = nextPrayerTime.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

export const getPrayerTimesList = (prayerTimes: PrayerTimes): PrayerTime[] => {
  const currentPrayer = getCurrentPrayer(prayerTimes);
  const nextPrayer = getNextPrayer(prayerTimes);

  // Debug: Log available fields from API
  console.log('Available prayer times fields:', Object.keys(prayerTimes));

  const prayerConfig = {
    Fajr: { name: 'Fajr', icon: '🌅' },
    Sunrise: { name: 'Sunrise', icon: '☀️' },
    Dhuhr: { name: 'Dhuhr', icon: '🌞' },
    Asr: { name: 'Asr', icon: '🌤️' },
    Maghrib: { name: 'Maghrib', icon: '🌆' },
    Isha: { name: 'Isha', icon: '🌙' },
  };

  return Object.entries(prayerConfig).map(([key, config]) => {
    const prayerTime = prayerTimes[key as keyof PrayerTimes];

    // Skip if prayer time is not available
    if (!prayerTime) {
      return {
        name: config.name,
        time: '--:--',
        adhanTime: '--:--',
        salatTime: '--:--',
        isNext: false,
        isCurrent: false,
        icon: config.icon,
      };
    }

    // Get API adhan time if available - check multiple possible field names
    const possibleAdhanKeys = [
      `${key}Adhan`,
      `${key.toLowerCase()}Adhan`,
      `${key}_adhan`,
      `${key.toLowerCase()}_adhan`
    ];

    let apiAdhanTime: string | undefined;
    for (const adhanKey of possibleAdhanKeys) {
      if (prayerTimes[adhanKey as keyof PrayerTimes]) {
        apiAdhanTime = prayerTimes[adhanKey as keyof PrayerTimes] as string;
        console.log(`Found adhan time for ${key}:`, apiAdhanTime);
        break;
      }
    }

    const adhanTime = getAdhanTime(prayerTime, apiAdhanTime);
    const salatTime = getSalatTime(prayerTime);

    return {
      name: config.name,
      time: formatPrayerTime(prayerTime),
      adhanTime: formatPrayerTime(adhanTime), // Keep for internal use (AdhanPlayer)
      salatTime: formatPrayerTime(salatTime), // Keep for internal use
      isNext: key === nextPrayer,
      isCurrent: key === currentPrayer,
      icon: config.icon,
    };
  });
};

// Calculate adhan time (typically varies by location and method)
export const getAdhanTime = (prayerTime: string, apiAdhanTime?: string): string => {
  // If API provides adhan time, use it
  if (apiAdhanTime) {
    try {
      const time = parseISO(`2000-01-01T${apiAdhanTime}`);
      return format(time, 'HH:mm');
    } catch {
      // Fall back to calculation if API time is invalid
    }
  }

  // Calculate adhan time based on prayer type and location
  try {
    const time = parseISO(`2000-01-01T${prayerTime}`);
    let adhanTime: Date;

    // Different adhan times for different prayers based on Islamic tradition
    const prayerHour = time.getHours();
    if (prayerHour < 6) { // Fajr - adhan typically 10-15 minutes before
      adhanTime = addMinutes(time, -10);
    } else if (prayerHour < 12) { // Dhuhr - adhan typically 5-10 minutes before
      adhanTime = addMinutes(time, -7);
    } else if (prayerHour < 16) { // Asr - adhan typically 5-7 minutes before
      adhanTime = addMinutes(time, -5);
    } else if (prayerHour < 19) { // Maghrib - adhan typically 3-5 minutes before
      adhanTime = addMinutes(time, -4);
    } else { // Isha - adhan typically 5-8 minutes before
      adhanTime = addMinutes(time, -6);
    }

    return format(adhanTime, 'HH:mm');
  } catch {
    return prayerTime;
  }
};

// Calculate salat time (typically right at prayer time)
export const getSalatTime = (prayerTime: string): string => {
  try {
    const time = parseISO(`2000-01-01T${prayerTime}`);
    const salatTime = addMinutes(time, 0); // At prayer time
    return format(salatTime, 'HH:mm');
  } catch {
    return prayerTime;
  }
};

export const getPrayerNameInArabic = (prayerName: string): string => {
  const arabicNames: Record<string, string> = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
  };

  return arabicNames[prayerName] || prayerName;
};

export const getCurrentDateFormatted = (locale: string): string => {
  const now = new Date();
  return now.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 
