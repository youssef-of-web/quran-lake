'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Settings');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 border border-slate-200 dark:border-slate-700"
        aria-label="Settings"
      >
        <SettingsIcon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
          {t('title')}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full mt-2 w-64 rounded-3xl bg-white dark:bg-surface-dark shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden transition-all duration-500 ${isRTL
                ? 'left-0 md:left-0 md:right-auto'
                : 'right-0 md:right-0 md:left-auto'
                }`}
            >
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    {t('title')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t('subtitle')}
                  </p>
                </div>

                {/* Language Settings */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t('language')}
                  </label>
                  <LocaleSwitcher variant="settings" />
                </div>

                {/* Theme Settings */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    {t('theme')}
                  </label>
                  <ThemeToggle variant="settings" />
                </div>

                {/* Additional Settings (for future use) */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t('comingSoon')}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 