import { getReciterById, getSurahList } from "@/api";
import Detail from "@/components/features/reciters/details/Detail";
import { RecitersResponse } from "@/types/Reciter";
import { Suwar } from "@/types/Surah";

import type { Metadata } from "next";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: number };
}): Promise<Metadata> {
  const reciter = await getReciterById<RecitersResponse>(id);
  return { title: reciter?.reciters[0].name };
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await getReciterById<RecitersResponse>(params.id);
  const surah_List = await getSurahList<Suwar>();
  const reciter = data?.reciters[0];

  return <Detail reciter={reciter!} surah_list={surah_List!.suwar} />;
}
