import { Song } from "./webdaw/types";
import { MIDIEvent } from "./webdaw/midi_events";
import { ParsedMIDIFile } from "./webdaw/parse_midi_binary";

export enum Transport {
  PLAY_REQUEST = "request-play",
  PLAY = "play",
  PAUSE = "pause",
  STOP = "stop",
}

export type RefMIDI = {
  id: string;
  song: Song;
  timestamp: number;
  millis: number;
  index: number;
  scheduled: MIDIEvent[];
};

export type ListData = {
  title: string,
  song: Song,
  duration: number,
}

export type ListDataJSON = {
  title: string,
  url: string,
  // order: number,
}


export type RootState = {
  loading: boolean,
  width: number,
  height: number,
  isPlaying: boolean,
  playheadPosition: number,
  transport: Transport,
  ListData: ListData[],
  currentMIDIFileIndex: 0,
  progress: 0,
  sliderProps: {
    max: number,
    min: number,
    value: number,
    id: string,
    label: string,
    onChange: () => void,
    onInput: ()=> void,
    step: number,
    type: "song-position",
    disabled: boolean,
  }
};

export type ProjectData = {
  tracks: [
    {
      order: number;
      title: string; 
      url: string;
    }
  ];
};
