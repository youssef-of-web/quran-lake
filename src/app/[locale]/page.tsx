import { getSurahList } from "@/api";
import SurahSection from "@/components/features/home/SurahSection";
import HeroSection from "@/components/features/home/HeroSection";
import { Suwar } from "@/types/Surah";

export default async function Component() {
  const suwar = await getSurahList<Suwar>();
  return (
    <main>
      <HeroSection />
      <SurahSection suwar={suwar!} />
    </main>
  );
}
