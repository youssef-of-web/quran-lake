'use client';
import { createContext, useState } from 'react';
import { IReciter } from '@/types/Reciter';
import { Surah } from '@/types/Surah';
import { generateServerUrlId } from '@/helpers/utils';
import AudioPlayer from '../AudioPlayer';
export interface Audio {
  open: boolean;
  setOpen: (open: boolean) => void;
  server: string;
  setServer: (server: string) => void;
  reciter: IReciter | null;
  setReciter: (server: IReciter | null) => void;
  surah: Surah | null;
  setSurah: (server: Surah | null) => void;
  list_surat?: Surah[];
  setSuratList: (server: Surah[]) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const AudioContext = createContext<Audio | null>(null);

export const AudioWrapper = ({
  children,
  recitersList,
}: {
  children: React.ReactNode;
  recitersList: IReciter[];
}) => {
  const [open, setOpen] = useState(false);
  const [server, setServer] = useState<string>('');
  const [reciter, setReciter] = useState<IReciter | null>(null);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [surah_list, setSuratList] = useState<Surah[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const PlayAudio = (surah: any, reciter: IReciter) => {
    setReciter(reciter);
    setServer(
      `${reciter?.moshaf[0].server}${generateServerUrlId(
        surah.id.toString()
      )}.mp3`
    );
    setOpen(true);
    setSurah(surah);
  };

  return (
    <AudioContext.Provider
      value={{
        open,
        setOpen,
        server,
        setServer,
        reciter,
        setReciter,
        surah,
        setSurah,
        setSuratList,
        playbackSpeed,
        setPlaybackSpeed,
      }}
    >
      <div className="min-h-screen pb-24">{children}</div>

      {open && reciter && (
        <AudioPlayer
          server={server}
          reciter={reciter}
          surah={surah!}
          recitersList={recitersList}
          playAudio={PlayAudio}
          surah_list={surah_list}
        />
      )}
    </AudioContext.Provider>
  );
};
