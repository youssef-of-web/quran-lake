import { fetchReciterById } from "@/lib/api-fetch";
import Detail from "@/components/features/reciters/details/Detail";
import { RecitersResponse } from "@/types/Reciter";
import { getMessages } from 'next-intl/server';
import { SurahData } from "@/data/data";

import type { Metadata } from "next";

export async function generateMetadata({
  params: { id, locale },
}: {
  params: { id: number; locale: string };
}): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Reciters as any;
  const reciter = await fetchReciterById<RecitersResponse>(id, locale);

  return {
    title: reciter?.reciters[0].name || t?.reciter || 'Reciter',
    description: `${t?.reciter || 'Reciter'}: ${reciter?.reciters[0].name || ''}`
  };
}

export default async function Page({ params }: { params: { id: number; locale: string } }) {
  const data = await fetchReciterById<RecitersResponse>(params.id, params.locale);
  // Use static surah data
  const surah_List = SurahData;
  const reciter = data?.reciters[0];

  return <Detail reciter={reciter!} surah_list={surah_List} />;
}
