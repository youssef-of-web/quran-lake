import { getReciters } from "@/api";
import Reciters from "@/components/features/reciters/Reciters";
import { RecitersResponse } from "@/types/Reciter";
import { Metadata } from "next";
import { getMessages } from 'next-intl/server';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Reciters as any;

  return {
    title: t?.title || 'Reciters',
    description: t?.description || 'Listen to the holy quran',
  };
}

export const revalidate = 3600; // revalidate every hour

export default async function Page() {
  const data = await getReciters<RecitersResponse>();

  return <Reciters reciters={data?.reciters!} />;
}
