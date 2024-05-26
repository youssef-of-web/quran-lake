export interface Surah {
  id: number;
  name: string;
  start_page: number;
  end_page: number;
  makkia: number;
  type: number;
}

export interface Suwar {
  suwar: Surah[];
}
