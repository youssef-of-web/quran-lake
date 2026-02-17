export interface Surah {
  id: number;
  name: string;
  start_page: number;
  end_page: number;
  makkia: number;
  type: number;
  verses_count?: number;
  number_of_ayahs?: number;
}

export interface Suwar {
  suwar: Surah[];
}
