"use client";

import { ChangeEventHandler } from "react";

interface ISearch {
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function Search({ placeholder, onChange }: ISearch) {
  return (
    <div className="relative px-4">
      <input
        type="text"
        className="h-12 w-full md:w-1/2 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none"
        placeholder={placeholder}
        onChange={onChange}
      />

      <div className="absolute top-4 right-3">
        <i className="fa fa-search text-base z-20"></i>
      </div>
    </div>
  );
}
