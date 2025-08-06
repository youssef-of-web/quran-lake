"use client";

import Button from "@/components/ui/Button";
import { Link } from "@/lib/intl";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface IHeroSection {}

export default function HeroSection({}: IHeroSection) {
  const translation = useTranslations("Home");

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-r from-slate-600 via-slate-500 to-primary">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-md"
            >
              {translation("title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
            >
              {translation("subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            >
              <Link href="/reciters">
                <Button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-primary shadow-lg transition-all hover:scale-105">
                  <span className="relative z-10 text-lg font-medium">
                    {translation("startListening")}
                  </span>
                  <div className="absolute inset-0 bg-gray-100 opacity-0 transition-opacity group-hover:opacity-100" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-700 to-transparent" />
    </section>
  );
}
