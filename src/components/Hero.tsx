"use client";

import { ChangeEventHandler } from "react";
import Search from "./Search";

interface IHero {
  title: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  children?: React.ReactNode;
}

export default function Hero({
  children,
  title,
  placeholder,
  onChange,
}: IHero) {
  return (
    <div className="text-center bg-gradient-to-r from-[#64748b] to-btnPrimary h-44 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <Search placeholder={placeholder} onChange={onChange} />
      </div>
      {children}
    </div>
  );
}
