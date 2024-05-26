import { getReciters } from "@/api";
import Reciters from "@/components/features/reciters/Reciters";
import { RecitersResponse } from "@/types/Reciter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reciters",
  description: "Listen to the holy quran",
};

export const revalidate = 3600; // revalidate every hour

export default async function Page() {
  const data = await getReciters<RecitersResponse>();

  return <Reciters reciters={data?.reciters!} />;
}
