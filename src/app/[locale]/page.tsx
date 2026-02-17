import { getSurahList } from "@/api";
import SurahSection from "@/components/features/home/SurahSection";
import HeroSection from "@/components/features/home/HeroSection";
import SurahTabs from "@/components/features/home/SurahTabs";
import { Suwar } from "@/types/Surah";
import { Metadata } from "next";
import { getMessages, getLocale } from 'next-intl/server';
import { BASE_URL } from '@/constants';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Home as any;
  const isArabic = params.locale === 'ar';
  
  const title = t?.title || 'The Holy Quran';
  const description = t?.subtitle || 'Listen to the Holy Quran';
  const ogTitle = isArabic ? 'القرآن الكريم - استمع وتلاوة' : 'The Holy Quran - Listen & Recite';
  const ogDescription = isArabic 
    ? 'استمع إلى القرآن الكريم بتلاوات جميلة من قراء مشهورين. تصفح جميع السور الـ 114 واعثر على أوقات الصلاة.'
    : 'Listen to the Holy Quran with beautiful recitations from renowned reciters. Browse all 114 surahs and find prayer times.';
  
  return {
    title: title,
    description: description,
    keywords: isArabic 
      ? ['القرآن', 'القرآن الكريم', 'تلاوة القرآن', 'صوت القرآن', 'إسلامي', 'مسلم', 'قراء', 'سورة', 'آية', 'أوقات الصلاة', 'أذان']
      : ['Quran', 'Holy Quran', 'Quran recitation', 'Quran audio', 'Islamic', 'Muslim', 'Reciters', 'Surah', 'Ayah', 'Prayer times', 'Adhan'],
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${BASE_URL}/${params.locale}`,
      siteName: isArabic ? 'القرآن الكريم' : 'The Holy Quran',
      locale: isArabic ? 'ar_SA' : 'en_US',
      alternateLocale: isArabic ? ['en_US'] : ['ar_SA'],
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/hero-page.png`,
          width: 1200,
          height: 630,
          alt: isArabic ? 'القرآن الكريم' : 'The Holy Quran',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [`${BASE_URL}/hero-page.png`],
    },
    alternates: {
      canonical: `${BASE_URL}/${params.locale}`,
      languages: {
        'en': `${BASE_URL}/en`,
        'ar': `${BASE_URL}/ar`,
      },
    },
  };
}

export default async function Component() {
  const suwar = await getSurahList<Suwar>();
  const locale = await getLocale();
  const isArabic = locale === 'ar';
  
  // Structured Data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: isArabic ? 'القرآن الكريم' : 'The Holy Quran',
    description: isArabic 
      ? 'استمع إلى القرآن الكريم بتلاوات جميلة من قراء مشهورين'
      : 'Listen to the Holy Quran with beautiful recitations from renowned reciters',
    url: `${BASE_URL}/${locale}`,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 space-y-12">
        <HeroSection />
        
        <section>
          <SurahSection suwar={suwar!} />
        </section>
      </div>
    </>
  );
}
