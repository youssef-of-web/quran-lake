"use client";
import { IMoshaf, IReciter } from "@/types/Reciter";
import { useState } from "react";
import Hero from "../../../Hero";
import Moshaf from "./Moshaf";
import Surah_List from "./SurahList";
import { Surah } from "@/types/Surah";
import { useTranslations } from "next-intl";

interface IDetail {
  reciter: IReciter;
  surah_list: Surah[];
}

export default function Detail({ reciter, surah_list }: IDetail) {
  const [current, setCurrent] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.toLowerCase());
  };
  const t = useTranslations("Reciters");
  const t_search = useTranslations("Search");

  return (
    <div className="text-gray-900 rounded-md px-0">
      {/* moshaf list */}
      <Hero
        title={`${t("reciter")} ${reciter.name}`}
        placeholder={t_search("placeholderSurah")}
        onChange={onChange}
      />
      <div className="flex flex-col gap-4 container mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-16">
          {reciter.moshaf?.map((moshaf: IMoshaf, index: number) => (
            <Moshaf
              {...moshaf}
              key={moshaf.id}
              current={current}
              setCurrent={setCurrent}
              index={index}
            />
          ))}
        </div>
        {reciter.moshaf && (
          <Surah_List
            current={current}
            reciter={reciter}
            text={text}
            surah_list={surah_list}
          />
        )}
      </div>
    </div>
  );
}
