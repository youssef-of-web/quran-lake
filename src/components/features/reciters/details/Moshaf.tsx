"use client";
import { IMoshaf } from "@/types/Reciter";
import classNames from "classnames";
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
  return (
    <div
      className={classNames(
        "w-full rounded-lg",
        current === index && "border-2 border-primary rounded-lg"
      )}
      onClick={() => setCurrent(index)}
    >
      <div className="min-h-[60px] flex items-center justify-center gap-4 bg-white shadow-xl rounded-lg text-gray-900 cursor-pointer p-2">
        <Image src={"/moshaf.png"} width={50} height={50} alt="mushaf" />
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <p className="text-md font-bold">{name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-primary text-ellipsis font-bold">
              {surah_total}
            </span>
            <p>سورة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
