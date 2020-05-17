import { RefMIDI } from "../types";
import { schedule, getSchedulerIndex } from "../../../webdaw/scheduler";
import { unschedule } from "../../../webdaw/unschedule";
import { midiAccess } from "../media";

export const startMIDI = (reference: RefMIDI, position: number): RefMIDI => {
  reference.timestamp = performance.now();
  // const m = position - part.start + part.trimStart;
  const m = position;
  reference.millis = m < 0 ? 0 : m;
  reference.index = getSchedulerIndex(reference.song, m);
  // console.log("START", reference.millis, position, reference.index);
  return reference;
};

export const playMIDI = (reference: RefMIDI): RefMIDI => {
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

export const stopMIDI = (reference: RefMIDI): RefMIDI => {
  unschedule(reference.song, midiAccess?.outputs);
  reference.index = 0;
  reference.millis = 0;
  reference.scheduled = [];
  return reference;
};