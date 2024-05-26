"use client";

import { ChangeEventHandler } from "react";

interface ISearch {
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Search({ placeholder, onChange }: ISearch) {
  return (
    <div className="relative">
      <input
        type="text"
        className="h-10 w-1/2 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none"
        placeholder={placeholder}
        onChange={onChange}
      />

      <div className="absolute top-4 right-3">
        <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i>
      </div>
    </div>
  );
}
