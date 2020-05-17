import { Song } from "../../webdaw/types";
import { MIDIEvent } from "../../webdaw/midi_events";

export enum Transport {
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
  duration: number;
  index: number;
  scheduled: MIDIEvent[];
};

export type Tracks = {
  title: string;
  song: Song;
  duration: number;
};

export type ListDataJSON = {
  title: string;
  url: string;
  // mood: string,
};

export type RootState = {
  loading: boolean;
  width: number;
  height: number;
  isPlaying: boolean;
  playheadMillis: number;
  playheadPixels: number;
  transport: Transport;
  tracks: RefMIDI[];
  currentTrack: RefMIDI;
  currentTrackIndex: number;
  progress: number;
  thumbX: number;
  lastX: number;
  wasPlaying: boolean;
  // editor
  numBars: number;
  numNotes: number;
  numerator: number;
  denominator: number;
  editData: EditData;
  zoomLevel: number;
  millisPerPixel: number;
  durationTimeline: number;
  editorScrollPos: number;
  notes: NoteUI[];
  ppq: number;
};

export type NoteUI = {
  id: string;
  ticks: number;
  noteNumber: number;
  duration: number;
};

export type EditData = {
  id: string;
  thumbX: number;
  lastX: number;
  action: string;
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
