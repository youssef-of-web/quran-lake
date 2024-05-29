"use client";
import { locales, usePathname, useRouter } from "@/lib/intl";
import { useLocale } from "next-intl";
import { ChangeEvent, useTransition } from "react";
interface ILocaleSwitcher {}

export default function LocaleSwitcher({}: ILocaleSwitcher) {
  const locale = useLocale();
  const pathname = usePathname();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChangeLocale = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      defaultValue={locale}
      disabled={isPending}
      onChange={onChangeLocale}
      style={{ backgroundColor: 'transparent'



       }} // Set background color to red
className="text-base"
    
    >
      {locales.map((l) => (
        <option value={l} key={l}>
          {l}
        </option>
      ))}
    </select>
  );
}
