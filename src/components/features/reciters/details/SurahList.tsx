"use client";

import { useContext, useMemo } from "react";
import { Audio, AudioContext } from "../../../context/AudioContext";
import Image from "next/image";
import { IReciter } from "@/types/Reciter";
import { Surah } from "@/types/Surah";
import { generateServerUrlId } from "@/helpers/utils";

interface InterfaceProps {
  readonly current: number;
  readonly reciter: IReciter;
  readonly text: string;
  readonly surah_list: Surah[];
}

export default function Surah_List({
  current,
  reciter,
  text,
  surah_list,
}: InterfaceProps) {
  const { setReciter } = useContext(AudioContext) as Audio;

  const moshaf = reciter?.moshaf![current];
  const {
    setServer,
    setOpen,
    setSurah,
    surah: surahDetail,
  } = useContext(AudioContext) as Audio;

  /* extract surat name from surah list api */
  const extractSuratList = surah_list?.filter((surah) =>
    moshaf.surah_list.split(",").some((s) => s === surah.id.toString())
  );

  /* const filteredList */
  const FilteredList = useMemo(() => {
    if (text != "") {
      return extractSuratList.filter((el) =>
        el.name.toLowerCase().includes(text)
      );
    }
    return extractSuratList;
  }, [text]);

  /* from context @see ./context/AudioContext */

  const PlayAudio = (surah: any) => {
    setReciter(reciter);
    setServer(
      `${moshaf.server}${generateServerUrlId(surah.id.toString())}.mp3`
    );
    setOpen(true);
    setSurah(surah);
  };

  return (
    <div className="mt-16">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {FilteredList.map((surah) => (
          <div
            onClick={() => PlayAudio(surah)}
            className={`${
              surah.id === surahDetail?.id &&
              "border-2 border-primary rounded-lg"
            }`}
            key={surah.id}
          >
            <div className="w-full">
              <div className="min-h-[50px] flex flex-col items-center justify-center bg-white shadow-xl rounded-lg text-gray-900 cursor-pointer">
                <Image
                  src={"/quran-icon.png"}
                  width={40}
                  height={40}
                  alt={`surat-${surah.name}`}
                />
                <span className="absolute -mt-5">{surah.id}</span>
                <p>{surah.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
