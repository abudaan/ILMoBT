import { SongData, NoteUI } from "../../types";
import { schedule, getSchedulerIndex } from "../../../../webdaw/scheduler";
import { unschedule } from "../../../../webdaw/unschedule";
import { midiAccess } from "../../media";
import { sortMIDIEvents } from "../../../../webdaw/midi_utils";
import { MIDIEvent } from "../../../../webdaw/midi_events";

export const startMIDI = (reference: SongData, position: number): SongData => {
  reference.timestamp = performance.now();
  // const m = position - part.start + part.trimStart;
  const m = position;
  reference.millis = m < 0 ? 0 : m;
  reference.index = getSchedulerIndex(reference.song, m);
  // console.log("START", reference.millis, position, reference.index);
  return reference;
};

export const playMIDI = (reference: SongData): SongData => {
  const { index, scheduled } = schedule({
    song: reference.song,
    millis: reference.millis,
    index: reference.index,
    outputs: midiAccess?.outputs,
  });
  const ts = performance.now();
  reference.millis += ts - reference.timestamp;
  reference.timestamp = ts;
  reference.index = index;
  reference.scheduled = scheduled;
  // console.log(reference.song.events.length, reference.millis, reference.index);
  return reference;
};

export const stopMIDI = (reference: SongData): SongData => {
  unschedule(reference.song, midiAccess?.outputs);
  reference.index = 0;
  reference.millis = 0;
  reference.scheduled = [];
  return reference;
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
