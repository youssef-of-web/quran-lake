'use client';
import { Link } from '@/lib/intl';
import { IReciter } from '@/types/Reciter';
import Image from 'next/image';

export default function Reciter({ name, id }: IReciter) {
  return (
    <Link href={`/reciters/${id}`}>
      <div className="group flex items-center p-4 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md dark:hover:shadow-slate-900/20">
        <div className="flex items-center gap-4">
          <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/reciter.png"
              width={40}
              height={40}
              alt={name}
              className="object-cover"
            />
          </div>
          <p className="font-semibold text-slate-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-white">
            {name}
          </p>
        </div>
      </div>
    </Link>
  );
}
