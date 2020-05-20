import { SongData, NoteUI } from "../types";
import { schedule, getSchedulerIndex } from "../../../webdaw/scheduler";
import { unschedule } from "../../../webdaw/unschedule";
import { midiAccess } from "../media";
import { sortMIDIEvents } from "../../../webdaw/midi_utils";
import { MIDIEvent } from "../../../webdaw/midi_events";

export const startMIDI = (data: SongData, position: number): SongData => {
  const m = position < 0 ? 0 : position;
  return {
    ...data,
    millis: m,
    index: getSchedulerIndex(data.song, m),
    timestamp: performance.now(),
  };
};

export const playMIDI = (data: SongData): SongData => {
  const { index, scheduled } = schedule({
    song: data.song,
    millis: data.millis,
    index: data.index,
    outputs: midiAccess?.outputs,
  });
  const timestamp = performance.now();
  return {
    ...data,
    millis: data.millis + (timestamp - data.timestamp),
    timestamp,
    index,
    scheduled,
  };
};

export const pauseMIDI = (data: SongData): SongData => {
  unschedule(data.song, midiAccess?.outputs);
  return { ...data, scheduled: [] };
};

export const stopMIDI = (data: SongData): SongData => {
  unschedule(data.song, midiAccess?.outputs);
  return { ...data, scheduled: [], millis: 0, index: 0 };
};

export const createMIDIEventsFromNotes = (
  notes: NoteUI[],
  noteMapping: number[],
  millisPerTick: number,
  trackId: string
): MIDIEvent[] =>
  sortMIDIEvents(
    notes
      .map(note => {
        const noteOn = {
          type: 0x90,
          descr: "note on",
          ticks: note.ticks,
          channel: 0,
          millis: note.ticks * millisPerTick,
          noteNumber: noteMapping[note.noteNumber],
          velocity: 100,
          trackId,
        };
        const noteOff = {
          type: 0x80,
          descr: "note off",
          ticks: note.ticks + note.duration,
          channel: 0,
          millis: (note.ticks + note.duration) * millisPerTick,
          noteNumber: noteMapping[note.noteNumber],
          velocity: 0,
          trackId,
        };
        return [noteOn, noteOff];
      })
      .flat()
  );

export const clock = (() => {
  let id: number;
  let run = false;

  const doPlay = (start: number, callback: (p: number) => void) => {
    if (run === false) {
      return;
    }
    const now = performance.now();
    const progress = now - start;
    callback(progress);
    id = requestAnimationFrame(b => {
      doPlay(now, callback);
    });
  };

  return {
    play: (start: number, callback: (p: number) => void) => {
      run = true;
      doPlay(start, callback);
    },
    stop: () => {
      run = false;
      cancelAnimationFrame(id);
    },
  };
})();
