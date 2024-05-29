"use client";
import { Audio, AudioContext } from "../../context/AudioContext";
import { useContext } from "react";
import { defaultReciter } from "@/data/data";
import { Suwar } from "@/types/Surah";
import Button from "../../ui/Button";
import { generateServerUrlId } from "@/helpers/utils";
import { useTranslations } from "next-intl";

interface ISurahSection {
  suwar: Suwar;
}

export default function SurahSection({ suwar }: ISurahSection) {
  const { setReciter, setServer, setOpen, setSurah } = useContext(
    AudioContext
  ) as Audio;
  const t = useTranslations("Reciters");

  const suratList = suwar?.suwar;
  /* from context @see ./context/AudioContext */

  const PlayAudio = (surah: any) => {
    defaultReciter.name = t("default.name");
    setReciter(defaultReciter);
    setOpen(true);
    setSurah(surah);
    setServer(
      `${defaultReciter.moshaf[0].server}${generateServerUrlId(
        surah.id.toString()
      )}.mp3`
    );
  };
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {suratList?.map((surah) => (
            <div
              key={surah.id}
              className="rounded-lg border border-base bg-bgPrimary p-4 shadow-sm transition-colors hover:bg-base/5"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{surah.name}</h3>
                </div>
                <Button onClick={() => PlayAudio(surah)}>
                  <PlayIcon className="h-6 w-6 fill-base" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}
