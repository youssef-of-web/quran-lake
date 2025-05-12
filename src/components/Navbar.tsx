'use client';

import { Link } from '@/lib/intl';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import { Github } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

interface INavbar {}

export default function Navbar({}: INavbar) {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 0);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`px-4 lg:px-6 h-14 flex items-center justify-between backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 w-full z-50 border-b border-gray-200 dark:border-gray-800 ${
        isScrolled ? 'fixed top-0' : 'relative'
      }`}
    >
      <Link href={'/'} className="flex items-center">
        <motion.p
          whileHover={{ scale: 1.05 }}
          className="text-xl font-bold text-gray-900 dark:text-white text-ellipsis transition-colors"
        >
          {t('logo')}
        </motion.p>
      </Link>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-4"
      >
        <LocaleSwitcher />
        <Link href={'/reciters'}>
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {t('reciters')}
          </motion.p>
        </Link>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="flex items-center justify-center h-10 w-10 bg-black dark:bg-white rounded-full"
        >
          <Link
            href={'https://github.com/youssef-of-web/quran-lake'}
            target="_blank"
          >
            <Github className="text-white dark:text-black transition-colors" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
