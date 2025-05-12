import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import { AudioWrapper } from '@/components/context/AudioContext';
import { getReciters } from '@/api';
import { RecitersResponse } from '@/types/Reciter';
import { getFilteredReciters } from '@/helpers/reciters';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import localFont from 'next/font/local';
import { PwaProvider } from '@/components/PwaProvider';
const arFont = localFont({
  src: './Rubik-MediumItalic.ttf',
});
const inter = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
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
      <body
        className={locale === 'ar' ? arFont.className : inter.className}
        suppressHydrationWarning={true}
      >
        <PwaProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="flex flex-col gap-8">
              <AudioWrapper recitersList={filteredreciters!}>
                <Navbar />
                {children}
              </AudioWrapper>
            </div>
          </NextIntlClientProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
