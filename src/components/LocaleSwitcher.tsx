'use client';
import { locales, usePathname, useRouter } from '@/lib/intl';
import { useLocale } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';
import { motion } from 'framer-motion';

interface ILocaleSwitcher {
  variant?: 'default' | 'settings';
}

export default function LocaleSwitcher({ variant = 'default' }: ILocaleSwitcher) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChangeLocale = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value as typeof locales[number];
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  if (variant === 'settings') {
    return (
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onChangeLocale}
        className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 
                   hover:border-primary dark:hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary 
                   transition-all duration-300 cursor-pointer
                   text-slate-700 dark:text-slate-200 text-sm"
      >
        {locales.map((l) => (
          <option
            value={l}
            key={l}
            className="bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200"
          >
            {l.toUpperCase()}
          </option>
        ))}
      </select>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const nextLocale = locale === 'en' ? 'ar' : 'en';
        startTransition(() => {
          router.replace(pathname, { locale: nextLocale });
        });
      }}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-700"
    >
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {locale === 'en' ? 'AR' : 'EN'}
      </span>
    </motion.button>
  );
}
