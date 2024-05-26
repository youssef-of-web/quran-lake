"use client";
import { Link } from "@/lib/intl";
import { IReciter } from "@/types/Reciter";
import Image from "next/image";

interface ReciterProps extends IReciter {}

export default function Reciter({ name, id }: ReciterProps) {
  return (
    <Link href={`/reciters/${id}`}>
      <div className="flex items-center p-4 h-22 shadow shadow-slate-300">
        <div className="text-center mt-2 flex items-center gap-4 h-12">
          <Image src={"/reciter.png"} width={25} height={25} alt={name} />
          <p className="font-bold text-lg">{name}</p>
        </div>
      </div>
    </Link>
  );
}
