"use client";

import { Link } from "@/lib/intl";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import { Github } from 'lucide-react';

import { ThemeSwitcher } from "./ui/ThemeSwitcher";

interface INavbar {}

export default function Navbar({}: INavbar) {
  const t = useTranslations("Navigation");
  return (
    <header className="px-4 bg-primary lg:px-6 h-14 flex items-center justify-between">
      <Link href={"/"} className="flex items-center">
        <p className="text-xl font-bold  text-ellipsis">
          {t("logo")}
        </p>
      </Link>
      <div className="flex items-center gap-4">
        <ThemeSwitcher/>
        <LocaleSwitcher />
        
        <Link href={"/reciters"}>
          <p className="bg-btnPrimary text-white rounded-md px-3 py-2 text-sm font-medium hover:ring-1">
            {t("reciters")}
          </p>
        </Link>
        <div className="flex items-center justify-center h-10 w-10 bg-black rounded-full">
          <Link
            href={"https://github.com/youssef-of-web/quran-lake"}
            target="_blank"
          >
            <Github className="text-base" />
          </Link>
        </div>
      </div>
    </header>
  );
}
