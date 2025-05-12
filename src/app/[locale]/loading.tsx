'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
      <div className="relative">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-4 border-transparent border-t-primary border-l-primary"
            style={{
              width: `${80 + index * 25}px`,
              height: `${80 + index * 25}px`,
              left: `calc(50% - ${40 + index * 12.5}px)`,
              top: `calc(50% - ${40 + index * 12.5}px)`,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.8 - index * 0.4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
