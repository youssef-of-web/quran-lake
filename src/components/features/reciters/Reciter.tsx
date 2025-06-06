'use client';
import { Link } from '@/lib/intl';
import { IReciter } from '@/types/Reciter';
import Image from 'next/image';

interface ReciterProps extends IReciter {}

export default function Reciter({ name, id }: ReciterProps) {
  return (
    <Link href={`/reciters/${id}`}>
      <div className="group flex items-center p-4 rounded-lg transition-all duration-300 hover:bg-slate-50 hover:shadow-md">
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
          <p className="font-semibold text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
            {name}
          </p>
        </div>
      </div>
    </Link>
  );
}
