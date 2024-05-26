"use client";

import Button from "@/components/ui/Button";
import { Link } from "@/lib/intl";
import { useTranslations } from "next-intl";

interface IHeroSection {}

export default function HeroSection({}: IHeroSection) {
  const t = useTranslations("Home");
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
          <Link href={"/reciters"}>
            <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300">
              {t("startListening")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
