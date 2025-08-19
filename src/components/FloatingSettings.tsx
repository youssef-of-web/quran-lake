'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

export default function FloatingSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('Settings');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className={`fixed top-1/2 -translate-y-1/2 z-50 ${isRTL ? 'right-4' : 'left-4'} md:block`}>
            <div className="relative">
                {/* Main Settings Button */}
                <motion.button
                    ref={buttonRef}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleButtonClick}
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
                                ref={dropdownRef}
                                initial={{ opacity: 0, scale: 0.95, x: isRTL ? 20 : -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: isRTL ? 20 : -20 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute top-0 w-72 rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden ${isRTL
                                    ? 'right-16 md:right-16 left-4 md:left-auto'
                                    : 'left-16 md:left-16 right-4 md:right-auto'
                                    }`}
                                onClick={handleDropdownClick}
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