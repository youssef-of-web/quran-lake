import SurahSection from "@/components/features/home/SurahSection";
import HeroSection from "@/components/features/home/HeroSection";
import { Metadata } from "next";
import { getMessages } from 'next-intl/server';
import { SurahData } from "@/data/data";
import { fetchSurahList } from "@/lib/api-fetch";
import { Suwar } from "@/types/Surah";

type HomeMessages = {
  title?: string;
  subtitle?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Home as HomeMessages;

  return {
    title: t?.title || 'The Holy Quran',
    description: t?.subtitle || 'Listen to the Holy Quran',
  };
}

export default async function Component({ params }: { params: { locale: string } }) {
  let suwar: Suwar = { suwar: SurahData };
  try {
    const data = await fetchSurahList<Suwar>(params.locale);
    if (data?.suwar?.length) {
      suwar = data;
    }
  } catch {
    suwar = { suwar: SurahData };
  }

  return (
    <>
      <HeroSection />
      <SurahSection suwar={suwar} />
    </>
  );
}
