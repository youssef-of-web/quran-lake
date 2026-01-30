import { fetchReciterById } from "@/lib/api-fetch";
import Detail from "@/components/features/reciters/details/Detail";
import { RecitersResponse } from "@/types/Reciter";
import { getMessages } from 'next-intl/server';
import { SurahData } from "@/data/data";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

type ReciterMessages = {
  reciter?: string;
};

export async function generateMetadata({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const messages = await getMessages();
  const t = messages.Reciters as ReciterMessages;
  const reciterId = Number(id);
  const reciter = Number.isNaN(reciterId)
    ? undefined
    : await fetchReciterById<RecitersResponse>(reciterId, locale);
  const reciterName = reciter?.reciters?.[0]?.name;

  return {
    title: reciterName || t?.reciter || 'Reciter',
    description: `${t?.reciter || 'Reciter'}: ${reciterName || ''}`
  };
}

export default async function Page({ params }: { params: { id: string; locale: string } }) {
  const reciterId = Number(params.id);
  if (Number.isNaN(reciterId)) {
    notFound();
  }
  const data = await fetchReciterById<RecitersResponse>(reciterId, params.locale);
  // Use static surah data
  const surah_List = SurahData;
  const reciter = data?.reciters?.[0];
  if (!reciter) {
    notFound();
  }

  return <Detail reciter={reciter} surah_list={surah_List} />;
}
