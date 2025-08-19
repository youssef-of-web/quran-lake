import { getReciterById, getSurahList } from "@/api";
import Detail from "@/components/features/reciters/details/Detail";
import { RecitersResponse } from "@/types/Reciter";
import { Suwar } from "@/types/Surah";
import { getMessages } from 'next-intl/server';

import type { Metadata } from "next";

export async function generateMetadata({
  params: { id, locale },
}: {
  params: { id: number; locale: string };
}): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Reciters as any;
  const reciter = await getReciterById<RecitersResponse>(id);

  return {
    title: reciter?.reciters[0].name || t?.reciter || 'Reciter',
    description: `${t?.reciter || 'Reciter'}: ${reciter?.reciters[0].name || ''}`
  };
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await getReciterById<RecitersResponse>(params.id);
  const surah_List = await getSurahList<Suwar>();
  const reciter = data?.reciters[0];

  return <Detail reciter={reciter!} surah_list={surah_List!.suwar} />;
}
