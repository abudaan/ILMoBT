import { SongData, NoteUI } from "../../types";
import { schedule, getSchedulerIndex } from "../../../../webdaw/scheduler";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { sortMIDIEvents } from "../../../../webdaw/midi_utils";
import { MIDIEvent } from "../../../../webdaw/midi_events";

export const startMIDI = (reference: SongData, position: number): SongData => {
  const m = position < 0 ? 0 : position;
  return {
    ...reference,
    millis: m,
    index: getSchedulerIndex(reference.song, m),
    timestamp: performance.now(),
  };
};

export const playMIDI = (reference: SongData): SongData => {
  const { index, scheduled } = schedule({
    song: reference.song,
    millis: reference.millis,
    index: reference.index,
    outputs: midiAccess?.outputs,
  });
  const timestamp = performance.now();
  return {
    ...reference,
    millis: reference.millis + (timestamp - reference.timestamp),
    timestamp,
    index,
    scheduled,
  };
};

export const pauseMIDI = (reference: SongData): SongData => {
  unschedule(reference.song, midiAccess?.outputs);
  return { ...reference, scheduled: [] };
};

export const stopMIDI = (reference: SongData): SongData => {
  unschedule(reference.song, midiAccess?.outputs);
  return { ...reference, scheduled: [], millis: 0, index: 0 };
};

export const createMIDIEventsFromNotes = (
  notes: NoteUI[],
  millisPerTick: number,
  trackId: string
): MIDIEvent[] =>
  sortMIDIEvents(
    notes
      .map(note => {
        const noteOn = {
          type: 0x80,
          descr: "note on",
          ticks: note.ticks,
          channel: 0,
          millis: note.ticks * millisPerTick,
          noteNumber: note.noteNumber,
          velocity: 100,
          trackId,
        };
        const noteOff = {
          type: 0x90,
          descr: "note off",
          ticks: note.ticks + note.duration,
          channel: 0,
          millis: (note.ticks + note.duration) * millisPerTick,
          noteNumber: note.noteNumber,
          velocity: 0,
          trackId,
        };
        return [noteOn, noteOff];
      })
      .flat()
  );
