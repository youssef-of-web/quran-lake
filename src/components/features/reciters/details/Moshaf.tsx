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
        'w-full rounded-lg transition-all duration-300 hover:scale-[1.02]',
        current === index
          ? 'border-2 border-primary bg-primary/5'
          : 'hover:border-primary/30 border-2 border-transparent'
      )}
      onClick={() => setCurrent(index)}
    >
      <div className="min-h-[60px] flex items-center justify-between px-4 py-3 bg-white shadow-sm rounded-lg text-gray-900 cursor-pointer">
        <div className="flex items-center gap-4">
          <Image
            src="/moshaf.png"
            width={45}
            height={45}
            alt="mushaf"
            className="object-contain"
          />
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <div className="flex items-center gap-2 text-primary font-medium">
              <span>{surah_total}</span>
              <span>{t('sourah')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
