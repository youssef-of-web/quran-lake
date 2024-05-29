"use client";
import { IMoshaf } from "@/types/Reciter";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface IProps extends IMoshaf {
  current: number;
  setCurrent: (current: number) => void;
  index: number;
}

export default function Moshaf({
  name,
  current,
  setCurrent,
  index,
  surah_total,
}: IProps) {
  const t = useTranslations("Words");
  return (
    <div
      className={classNames(
        "w-full rounded-lg",
        current === index && "border-2 border-base rounded-lg"
      )}
      onClick={() => setCurrent(index)}
    >
      <div className="min-h-[60px] flex items-center justify-center gap-4 bg-bgPrimary shadow-xl rounded-lg  cursor-pointer p-2">
        <Image src={"/moshaf.png"} width={50} height={50} alt="mushaf" />
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <p className="text-md font-bold">{name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex gap-2 text-primary text-ellipsis font-bold">
              {surah_total} <p>{t("sourah")}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
