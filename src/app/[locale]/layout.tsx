import type { Metadata } from 'next';
import { Amiri, Figtree } from 'next/font/google';
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
const arFont = Amiri({
  subsets: ['arabic'],
  weight: ['400'],
});

const inter = Figtree({
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Holy Quran',
  description: 'Listen to the holy quran',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon_192x192.png',
    icon: '/icon_192x192.png',
    shortcut: '/icon_192x192.png',
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
        className={`${locale === 'ar' ? arFont.className : inter.className} bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <div className="hidden md:block">
              <FloatingSettings />
            </div>
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
