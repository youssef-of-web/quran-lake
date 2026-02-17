'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  const githubUrl = 'https://github.com/youssef-of-web/quran-lake';

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>{t('madeWith')}</span>
            <span className="text-red-500 dark:text-red-400 animate-pulse">♥</span>
          </div>

          {/* Copyright */}
          <div className="text-sm text-slate-600 dark:text-slate-400">
            © {currentYear} {t('copyright')}
          </div>

          {/* GitHub Link */}
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light transition-colors duration-200"
            aria-label="View on GitHub"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
