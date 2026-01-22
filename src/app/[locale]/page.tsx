import SurahSection from "@/components/features/home/SurahSection";
import HeroSection from "@/components/features/home/HeroSection";
import { Metadata } from "next";
import { getMessages } from 'next-intl/server';
import { SurahData } from "@/data/data";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Home as any;

  return {
    title: t?.title || 'The Holy Quran',
    description: t?.subtitle || 'Listen to the Holy Quran',
  };
}

export const revalidate = 3600; // Cache for 1 hour

export default function Component() {
  // Use static data directly - 0ms latency
  const suwar = { suwar: SurahData };

  return (
    <>
      <HeroSection />
      <SurahSection suwar={suwar} />
    </>
  );
}
