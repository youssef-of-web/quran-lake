'use client';

import { ChangeEventHandler } from 'react';
import Search from './Search';
import { motion } from 'framer-motion';

interface IHero {
  title: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  children?: React.ReactNode;
}

export default function Hero({
  children,
  title,
  placeholder,
  onChange,
}: IHero) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center bg-gradient-to-br from-primary via-[#0a1e2f] to-slate-900 dark:to-black min-h-[11rem] flex items-center justify-center p-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 dark:opacity-25 mix-blend-overlay bg-cover bg-center"></div>

      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-4xl font-bold text-white dark:text-gray-100 tracking-tight drop-shadow-md"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Search placeholder={placeholder} onChange={onChange} />
        </motion.div>
      </div>
      {children}
    </motion.div>
  );
}
