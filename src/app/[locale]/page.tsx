import { getSurahList } from "@/api";
import SurahSection from "@/components/features/home/SurahSection";
import HeroSection from "@/components/features/home/HeroSection";
import { Suwar } from "@/types/Surah";
import { Metadata } from "next";
import { getMessages } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Home as any;
  
  return {
    title: t?.title || 'The Holy Quran',
    description: t?.subtitle || 'Listen to the Holy Quran',
  };
}

export default async function Component() {
  const suwar = await getSurahList<Suwar>();
  return (
    <>
      <HeroSection />
      <SurahSection suwar={suwar!} />
    </>
  );
}
