import { fetchReciters } from "@/lib/api-fetch";
import Reciters from "@/components/features/reciters/Reciters";
import { RecitersResponse } from "@/types/Reciter";
import { Metadata } from "next";
import { getMessages } from 'next-intl/server';

type RecitersMessages = {
  title?: string;
  description?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Reciters as RecitersMessages;

  return {
    title: t?.title || 'Reciters',
    description: t?.description || 'Listen to the holy quran',
  };
}

export const revalidate = 3600; // revalidate every hour

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const data = await fetchReciters<RecitersResponse>(locale);

  return <Reciters reciters={data?.reciters ?? []} />;
}
