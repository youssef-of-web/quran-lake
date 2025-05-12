'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full border-4 border-transparent border-t-primary border-l-primary`}
            style={{
              width: `${100 + index * 30}px`,
              height: `${100 + index * 30}px`,
              left: `${-15 * index}px`,
              top: `${-15 * index}px`,
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2 - index * 0.3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
