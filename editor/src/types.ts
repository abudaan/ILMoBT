import { Song } from "../../webdaw/types";
import { MIDIEvent } from "../../webdaw/midi_events";

export enum Transport {
  PLAY = "play",
  PAUSE = "pause",
  STOP = "stop",
}

export type SongData = {
  song: Song;
  timestamp: number;
  millis: number;
  index: number;
  numNotes: number;
  numBars: number;
  scheduled: MIDIEvent[];
  noteMapping: number[];
  millisPerTick: number;
};

export type RootState = {
  loading: boolean;
  width: number;
  height: number;
  isPlaying: boolean;
  playheadMillis: number;
  playheadPixels: number;
  transport: Transport;
  songData: SongData;
  progress: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  wasPlaying: boolean;
  // editor
  zoomLevel: number;
  seekZoomLevel: number;
  millisPerPixel: number;
  ticksPerPixel: number;
  editorScrollPos: number;
  notes: NoteUI[];
  currentNote: NoteUI;
  noteHeight: number;
  editAction: string;
  noteIndex: number;
};

export type NoteUI = {
  id: string;
  ticks: number;
  noteNumber: number;
  originalNoteNumber?: number;
  duration: number;
};
