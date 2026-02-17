import type { Metadata } from 'next';
import { Amiri, Manrope } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import { AudioWrapper } from '@/components/context/AudioContext';
import { ThemeProvider } from '@/components/context/ThemeContext';
import FloatingSettings from '@/components/FloatingSettings';
import { getReciters } from '@/api';
import { RecitersResponse } from '@/types/Reciter';
import { getFilteredReciters } from '@/helpers/reciters';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { BASE_URL } from '@/constants';
const arFont = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-arabic',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'The Holy Quran - Listen & Recite',
    template: '%s | The Holy Quran'
  },
  description: 'Listen to the Holy Quran with beautiful recitations from renowned reciters. Browse all 114 surahs, find prayer times, and immerse yourself in the divine words.',
  keywords: ['Quran', 'Holy Quran', 'Quran recitation', 'Quran audio', 'Islamic', 'Muslim', 'Reciters', 'Surah', 'Ayah', 'Prayer times', 'Adhan'],
  authors: [{ name: 'Quran Lake' }],
  creator: 'Quran Lake',
  publisher: 'Quran Lake',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icon_192x192.png',
    icon: '/icon_192x192.png',
    shortcut: '/icon_192x192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_SA'],
    siteName: 'The Holy Quran',
    title: 'The Holy Quran - Listen & Recite',
    description: 'Listen to the Holy Quran with beautiful recitations from renowned reciters. Browse all 114 surahs and find prayer times.',
    images: [
      {
        url: '/hero-page.png',
        width: 1200,
        height: 630,
        alt: 'The Holy Quran',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Holy Quran - Listen & Recite',
    description: 'Listen to the Holy Quran with beautiful recitations from renowned reciters.',
    images: ['/hero-page.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const data = await getReciters<RecitersResponse>();
  const filteredreciters = getFilteredReciters(data?.reciters!);
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${arFont.variable} bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
         {/*    <div className="hidden md:block">
              <FloatingSettings />
            </div> */}
            <div className="flex flex-col gap-8">
              <AudioWrapper recitersList={filteredreciters!}>
                <Navbar />
                {children}
              </AudioWrapper>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
