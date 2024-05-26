"use client";
import { IReciter } from "@/types/Reciter";
import Reciter from "./Reciter";
import Hero from "../../Hero";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

interface IReciters {
  readonly reciters: IReciter[];
}

export default function Reciters({ reciters }: IReciters) {
  const [text, setText] = useState<string>("");
  const filetredReciters = useMemo(() => {
    if (text != "") {
      return reciters.filter((reciter) =>
        reciter.name.toLowerCase().includes(text)
      );
    }
    return reciters;
  }, [text]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value.toLowerCase());
  };

  const t = useTranslations("Reciters");
  const t_search = useTranslations("Search");
  return (
    <>
      <Hero
        placeholder={t_search("placeholderReciters")}
        onChange={onChange}
        title={t("title")}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 container mx-auto px-2">
        {filetredReciters?.map((reciter) => (
          <Reciter {...reciter} />
        ))}
      </div>
    </>
  );
}
