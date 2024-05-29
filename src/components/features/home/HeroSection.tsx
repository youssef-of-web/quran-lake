"use client";

import Button from "@/components/ui/Button";
import { Link } from "@/lib/intl";
import { useTranslations } from "next-intl";

interface IHeroSection {}

export default function HeroSection({}: IHeroSection) {
  const t = useTranslations("Home");
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-bgSecondary ">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl  font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-[700px]   md:text-xl ">
              {t("subtitle")}
            </p>
          </div>
          <Link href={"/reciters"}>
            <Button className="inline-flex h-9 items-center justify-center rounded-md bg-btnPrimary text-white px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
              {t("startListening")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
