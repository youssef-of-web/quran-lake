"use client";

import { usePathname } from "next/navigation";
import { ChangeEventHandler, useState } from "react";

interface ISearch {
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Search({ placeholder, onChange }: ISearch) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative px-4 w-full md:w-2/3 mx-auto">
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? "transform scale-105" : ""
        }`}
      >
        <input
          type="text"
          className="h-12 w-full px-5 py-3 rounded-full bg-white/90 backdrop-blur-sm
                     border border-gray-200 shadow-sm
                     transition-all duration-300 ease-in-out
                     focus:outline-none focus:border-blue-500
                     placeholder:text-gray-400"
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div
          className={`absolute ${
            locale === 'ar' ? "left-4" : "right-4"
          } top-1/2 -translate-y-1/2 
                        text-gray-400 transition-colors duration-300 
                        hover:text-blue-500 cursor-pointer`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
