"use client";
import { Link } from "@/lib/intl";
import { IReciter } from "@/types/Reciter";
import { Surah } from "@/types/Surah";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
          ? `h-40 fixed bottom-0 bg-slate-150 w-full bg-bgSecondary`
          : `h-14 fixed bottom-0 bg-slate-150 w-full bg-bgSecondary`
      }
    >
      <div className="relative max-w-2xl mx-auto flex flex-col items-center justify-center gap-4">
        <Link
          href={`/reciters/${reciter.id}`}
          className="flex items-center gap-2"
        >
          <Image
            src={"/reciter.png"}
            width={25}
            height={14}
            alt={reciter.name}
            className="mt-1"
          />
          <p className="text-ellipsis mt-4">
            {`${reciter.name}- ${surah?.name}`}{" "}
          </p>
        </Link>
        {/* audio */}
        <audio
          controls
          autoPlay={true}
          src={server}
          loop
          className="w-full h-6  bg-slate-150 border-none"
        ></audio>
        {/* select */}
        <div className="w-full px-4">
          <Select
            onChange={(e) =>
              playAudio(surah, recitersList.find((r) => r.id === +e?.value!)!)
            }
            placeholder={t("changeReciter")}
            options={options}
            className="w-full bg-bgPrimary text-base "
            menuPlacement="top"
            
            styles={{
              control: (provided, state) => ({
                ...provided,
                boxShadow: "none",
                backgroundColor: "var(--select-bg)",
              
              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'text-base',
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? 'white' : 'var(--select-text)',
                backgroundColor: state.isSelected ? '#0e3b5a' : 'var(--select-bg)',
                ":hover": {
                  backgroundColor: "#0E3C5A6A",
                },

              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: 'var(--select-bg)', // Customize this value
              }),
            }}
          />
        </div>
      </div>
      <div className="absolute top-0 right-0 mt-2 mr-4 w-6 h-6 rounded-full hover:bg-base/10 bg-bgPrimary  flex items-center justify-center cursor-pointer">
        <div className="m-4">
          {open ? (
            <ArrowDownCircle className={"w-6 h-6"} onClick={handleOpen} />
          ) : (
            <ArrowUpCircle className="w-6 h-6" onClick={handleOpen} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
