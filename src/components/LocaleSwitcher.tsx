'use client';
import { locales, usePathname, useRouter } from '@/lib/intl';
import { useLocale } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';
import { motion } from 'framer-motion';

interface ILocaleSwitcher {}

export default function LocaleSwitcher({}: ILocaleSwitcher) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChangeLocale = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onChangeLocale}
        className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-[6px] pr-8 
                   hover:border-blue-500 dark:hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   transition-all duration-200 cursor-pointer
                   text-gray-700 dark:text-gray-200"
      >
        {locales.map((l) => (
          <option
            value={l}
            key={l}
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            {l.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
      {isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 left-0 w-full h-full bg-black/10 dark:bg-white/10 rounded-lg"
        />
      )}
    </motion.div>
  );
}
