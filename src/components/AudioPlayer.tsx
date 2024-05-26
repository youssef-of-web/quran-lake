"use client";
import { Link } from "@/lib/intl";
import { IReciter } from "@/types/Reciter";
import { Surah } from "@/types/Surah";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Select from "react-select";
interface IPlayer {
  reciter: IReciter;
  surah: Surah;
  server: string;
  recitersList: IReciter[];
  playAudio: (surah: Surah, reciter: IReciter) => void;
}

export default function AudioPlayer({
  reciter,
  surah,
  server,
  recitersList,
  playAudio,
}: IPlayer) {
  const options = recitersList.flatMap((r) => {
    return {
      label: r.name,
      value: r.id.toString(),
    };
  });
  const [open, setOpen] = useState<boolean>(true);
  const t = useTranslations("Search");

  const handleOpen = () => setOpen(!open);
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={
        open
          ? `h-48 fixed bottom-0 bg-slate-150 w-full bg-[#F0F3F4]`
          : `h-16 fixed bottom-0 bg-slate-150 w-full bg-[#F0F3F4]`
      }
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">
        <Link href={`/reciters/${reciter.id}`}>
          <p className="text-xl mt-4">{`${reciter.name}- ${surah?.name}`} </p>
        </Link>
        {/* audio */}
        <audio
          controls
          autoPlay={true}
          src={server}
          loop
          className="w-full h-10 mb-5 bg-slate-150 border-none"
        ></audio>
        {/* select */}
        <Select
          onChange={(e) =>
            playAudio(surah, recitersList.find((r) => r.id === +e?.value!)!)
          }
          placeholder={t("changeReciter")}
          options={options}
          className="w-full mb-6"
          menuPlacement="top"
          styles={{
            control: (provided, state) => ({
              ...provided,
              boxShadow: "none",
              border: "none",
            }),
          }}
        />
      </div>
      <div className="absolute top-0 right-0 mt-4 mr-4 w-8 h-8 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center cursor-pointer">
        <div className="m-4">
          {open ? (
            <ArrowDown className={"w-8 h-8"} onClick={handleOpen} />
          ) : (
            <ArrowUp className="w-8 h-8" onClick={handleOpen} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
