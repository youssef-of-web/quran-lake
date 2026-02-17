'use client';
import { IMoshaf } from '@/types/Reciter';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface IProps extends IMoshaf {
  current: number;
  setCurrent: (current: number) => void;
  index: number;
}

export default function Moshaf({
  name,
  current,
  setCurrent,
  index,
  surah_total,
}: IProps) {
  const t = useTranslations('Words');

  return (
    <div
      className={classNames(
        'w-full rounded-3xl transition-all duration-500 cursor-pointer',
        current === index
          ? 'border-2 border-primary bg-primary/10 dark:bg-primary/20 shadow-lg shadow-primary/10'
          : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-primary-light/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 shadow-sm'
      )}
      onClick={() => setCurrent(index)}
    >
      <div className="min-h-[80px] flex items-center justify-between px-6 py-4 text-slate-800 dark:text-white">
        <div className="flex items-center gap-4">
          <Image
            src="/moshaf.png"
            width={45}
            height={45}
            alt="mushaf"
            className="object-contain"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{name}</h3>
            <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-medium text-sm">
              <span>{surah_total}</span>
              <span>{t('sourah')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
