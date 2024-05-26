import { IReciter } from "@/types/Reciter";

/* filter reciters  */
export const getFilteredReciters = (data: IReciter[]) => {
  const filteredreciters = data?.filter((r) =>
    r.moshaf.some((i) => i.surah_list.split(",").length === 114)
  );
  return filteredreciters;
};
