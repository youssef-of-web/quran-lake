export interface IMoshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  moshaf_type: number;
  surah_list: string;
}

export interface IReciter {
  id: number;
  name: string;
  letter: string;
  date: string;
  moshaf: IMoshaf[];
}

export interface RecitersResponse {
  reciters: IReciter[];
}
