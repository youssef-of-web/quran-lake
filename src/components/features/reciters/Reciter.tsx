'use client';
import { Link } from '@/lib/intl';
import { IReciter } from '@/types/Reciter';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface ReciterProps extends IReciter { }

export default function Reciter({ name, id, moshaf }: ReciterProps) {
  const locale = useLocale();
  const t = useTranslations('Reciters');
  const t_words = useTranslations('Words');
  
  // Calculate total surahs from all moshafs (use max or sum, here using max)
  const totalSurahs = moshaf && moshaf.length > 0 
    ? Math.max(...moshaf.map(m => m.surah_total))
    : 0;
  
  return (
    <Link href={`/reciters/${id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-primary-light/50 rounded-3xl p-5 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 cursor-pointer overflow-hidden shadow-sm flex flex-col justify-between min-h-[120px]"
      >
        {/* Top Section - Reciter Name */}
        <div className={`flex items-start ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
              {name}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
              {totalSurahs} {t_words('sourah')}
            </p>
          </div>
        </div>

        {/* Bottom Section - Play Button */}
        <div className={`flex items-center ${locale === 'ar' ? 'justify-end' : 'justify-end'}`}>
          <button className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-xl">play_arrow</span>
          </button>
        </div>
        
        {/* Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-light/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </motion.div>
    </Link>
  );
}
