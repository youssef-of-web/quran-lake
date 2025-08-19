'use client';

import { Link } from '@/lib/intl';
import { useTranslations } from 'next-intl';
import { Github } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { InstallButton } from './Install';
import Settings from './Settings';

interface INavbar { }

export default function Navbar({ }: INavbar) {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll effect
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 0);
    });
  }, [scrollY]);

  // Close mobile menu on scroll
  useEffect(() => {
    if (mobileMenuOpen && scrollY.get() > 50) {
      setMobileMenuOpen(false);
    }
  }, [scrollY, mobileMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`px-4 lg:px-6 h-16 flex items-center justify-between backdrop-blur-sm bg-white/70 dark:bg-slate-800/90 w-full z-50 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-md' : 'relative'
        }`}
    >
      {/* Logo */}
      <Link href={'/'} className="flex items-center">
        <motion.p
          whileHover={{ scale: 1.05 }}
          className="text-base md:text-xl font-bold text-gray-900 dark:text-white text-ellipsis transition-colors truncate max-w-[200px] md:max-w-none"
        >
          {t('logo')}
        </motion.p>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4">
        <InstallButton />
        <Link href={'/reciters'}>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t('reciters')}
          </motion.p>
        </Link>
        <Link href={'/prayer-times'}>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="bg-green-600 text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {t('prayerTimes')}
          </motion.p>
        </Link>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="flex items-center justify-center h-10 w-10 bg-black dark:bg-white rounded-full"
        >
          <Link
            href={'https://github.com/youssef-of-web/quran-lake '}
            target="_blank"
            aria-label="GitHub"
          >
            <Github className="text-white dark:text-black transition-colors" />
          </Link>
        </motion.div>
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden p-2 text-gray-900 dark:text-white focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {mobileMenuOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`${mobileMenuOpen ? 'block' : 'hidden'
          } fixed top-16 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-4 shadow-lg md:hidden z-40`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Link
              href={'/reciters'}
              className="text-gray-900 dark:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('reciters')}
            </Link>
            <InstallButton />
          </div>
          <div className="flex justify-between items-center">
            <Link
              href={'/prayer-times'}
              className="text-gray-900 dark:text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('prayerTimes')}
            </Link>
            <Settings />
          </div>
          <div className="flex justify-center">
            <Link
              href={'https://github.com/youssef-of-web/quran-lake '}
              target="_blank"
              className="flex items-center justify-center h-10 w-10 bg-black dark:bg-white rounded-full"
            >
              <Github className="text-white dark:text-black transition-colors" />
            </Link>
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}
