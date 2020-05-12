import { Song } from "./webdaw/types";
import { MIDIEvent } from "./webdaw/midi_events";

export enum Transport {
  PLAY_REQUEST = "request-play",
  PLAY = "play",
  PAUSE = "pause",
  STOP = "stop",
}

export type RefMIDI = {
  id: string;
  title: string;
  song: Song;
  timestamp: number;
  millis: number;
  duration: number,
  index: number;
  scheduled: MIDIEvent[];
};

export type Tracks = {
  title: string,
  song: Song,
  duration: number,
}

export type ListDataJSON = {
  title: string,
  url: string,
  // mood: string,
}


export type RootState = {
  loading: boolean,
  width: number,
  height: number,
  isPlaying: boolean,
  playheadPosition: number,
  playheadPercentage: number,
  transport: Transport,
  tracks: RefMIDI[],
  currentTrack: RefMIDI,
  currentTrackIndex: number,
  progress: number,
  thumbX: number,
  lastX: number,
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
