'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

export default function FloatingSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Settings');

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block">
            <div className="relative">
                {/* Main Settings Button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200"
                    aria-label={t('title')}
                >
                    <SettingsIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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

                            {/* Settings Panel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-16 top-0 w-72 rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden"
                            >
                                <div className="p-4 space-y-4">
                                    {/* Header */}
                                    <div className="border-b border-gray-200 dark:border-slate-700 pb-3">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {t('title')}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {t('subtitle')}
                                        </p>
                                    </div>

                                    {/* Language Settings */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                            {t('language')}
                                        </label>
                                        <LocaleSwitcher variant="settings" />
                                    </div>

                                    {/* Theme Settings */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                            {t('theme')}
                                        </label>
                                        <ThemeToggle variant="settings" />
                                    </div>

                                    {/* Additional Settings (for future use) */}
                                    <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {t('comingSoon')}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
} 