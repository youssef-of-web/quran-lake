'use client';

import { Link } from '@/lib/intl';
import { useTranslations, useLocale } from 'next-intl';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { getPrayerTimesList } from '@/helpers/prayerTimes';

export default function PrayerTimesHome() {
  const t = useTranslations('PrayerTimes');
  const locale = useLocale();
  const { prayerTimes } = usePrayerTimes();

  if (!prayerTimes) {
    return null;
  }

  const prayers = getPrayerTimesList(prayerTimes.data.timings, locale);
  const nextPrayer = prayers.find(p => p.isNext) || prayers[0];

  const prayerIcons: Record<string, string> = {
    fajr: 'wb_twilight',
    sunrise: 'light_mode',
    dhuhr: 'light_mode',
    asr: 'wb_sunny',
    maghrib: 'bedtime',
    isha: 'dark_mode',
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
        <Link 
          href="/prayer-times"
          className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-accent-green transition-colors flex items-center gap-1"
        >
          {t('fullSchedule') || (locale === 'en' ? 'Full Schedule' : 'الجدول الكامل')} 
          <span className="material-symbols-outlined text-sm rotate-0 rtl:rotate-180">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {prayers.slice(0, 5).map((prayer) => (
          <div 
            key={prayer.name}
            className={`
              relative p-6 rounded-3xl flex flex-col gap-4 transition-all duration-500 group
              ${prayer.isNext 
                ? 'bg-gradient-to-br from-primary/10 to-slate-100 dark:from-primary/30 dark:to-surface-dark border-2 border-accent-green/40 shadow-xl shadow-accent-green/5 cursor-default' 
                : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-primary-light/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 shadow-sm cursor-default'}
            `}
          >
            {prayer.isNext && (
              <div className={`absolute top-4 ${locale === 'ar' ? 'left-4' : 'right-4'} flex items-center gap-2`}>
                <span className="text-[10px] font-bold text-accent-green tracking-widest uppercase">{locale === 'en' ? 'Next' : 'القادم'}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                </span>
              </div>
            )}

            <div className={`
              p-3 w-fit rounded-2xl transition-all duration-300
              ${prayer.isNext 
                ? 'bg-accent-green text-white shadow-lg shadow-accent-green/20' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary/10 dark:group-hover:bg-slate-700 group-hover:text-primary dark:group-hover:text-amber-300'}
            `}>
              <span className="material-symbols-outlined text-2xl">{prayerIcons[prayer.name.toLowerCase()] || 'schedule'}</span>
            </div>

            <div>
              <h3 className={`text-xl font-bold ${prayer.isNext ? 'text-primary dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                {t(`prayers.${prayer.name.toLowerCase()}`)}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-lg font-mono ${prayer.isNext ? 'text-primary dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                  {prayer.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
