import { Transport, VAMPart, RefVideo, RefAudio, RefMIDI } from "./types";
import { schedule, getSchedulerIndex } from "./webdaw/scheduler";
import { audioContext, midiAccess } from "./media";
import { unschedule } from "./webdaw/unschedule";
import { startAudioEvent, AudioEvent, stopAudioEvent } from "./webdaw/audio_event";

const buffer = 50;

const playAudio = (part: VAMPart, ref: RefAudio, position: number): RefAudio => {
  ref.audioEvent.start = audioContext.currentTime + (part.start - position) / 1000;
  ref.audioEvent.offset = (Math.abs(position - part.start) + part.trimStart) / 1000;
  ref.audioEvent.duration = (part.duration - part.trimStart + part.trimEnd) / 1000;
  const a: AudioEvent = startAudioEvent(audioContext, ref.audioEvent);
  ref.audioEvent.audioNode = a.audioNode;
  return ref;
};

const stopAudio = (reference: RefAudio): RefAudio => {
  // const audioEvent = stopAudioEvent(reference.audioEvent);
  // return {
  //   ...reference,
  //   audioEvent,
  // };
  reference.audioEvent = stopAudioEvent(reference.audioEvent);
  return reference;
};

const startMIDI = (reference: RefMIDI, part: VAMPart, position: number): RefMIDI => {
  reference.timestamp = performance.now();
  const m = position - part.start + part.trimStart;
  reference.millis = m < 0 ? 0 : m;
  reference.index = getSchedulerIndex(reference.song, m);
  // console.log("START", reference.millis, position);
  return reference;
};

const playMIDI = (reference: RefMIDI): RefMIDI => {
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
  // console.log(ref.millis, ref.index);
  return reference;
};

const stopMIDI = (reference: RefMIDI): RefMIDI => {
  unschedule(reference.song, reference.scheduled, midiAccess?.outputs);
  reference.index = 0;
  reference.millis = 0;
  reference.scheduled = [];
  return reference;
};

export const processTransportParts = (
  partsById: { [id: string]: VAMPart },
  referencesById: { [id: string]: RefVideo | RefAudio | RefMIDI },
  transport: Transport
): [{ [id: string]: VAMPart }, { [id: string]: RefVideo | RefAudio | RefMIDI }] => {
  const result = Object.keys(partsById).map(key => {
    const part = partsById[key];
    part.transport = transport;
    let reference = referencesById[key];
    if (part.type === "audio") {
      try {
        reference = stopAudio(reference as RefAudio);
      } catch (e) {}
    } else if (part.type === "midi") {
      reference = stopMIDI(reference as RefMIDI);
    }
    return [part, reference];
  });

  return [
    result.reduce((acc, [part]) => {
      acc[part.id] = part;
      return acc;
    }, {}),
    result.reduce((acc, [_, reference]) => {
      acc[reference.id] = reference;
      return acc;
    }, {}),
  ];
};

export const processPositionParts = (
  partsById: { [id: string]: VAMPart },
  referencesById: { [id: string]: RefVideo | RefAudio | RefMIDI },
  position: number,
  transport: Transport
): [{ [id: string]: VAMPart }, { [id: string]: RefVideo | RefAudio | RefMIDI }] => {
  const result = Object.keys(partsById).map(key => {
    const part = partsById[key];
    const max = part.start + part.duration - part.trimStart + part.trimEnd;
    let reference = referencesById[key];
    // console.log(part.type, part.start, max, position);
    if (position + buffer >= part.start && position < max) {
      if (transport === Transport.PLAY) {
        if (part.transport !== Transport.PLAY) {
          if (part.type === "audio") {
            // console.log("START", part.type, part.transport);
            reference = playAudio(part, reference as RefAudio, position);
          } else if (part.type === "midi") {
            reference = startMIDI(reference as RefMIDI, part, position);
          }
          part.transport = Transport.PLAY;
        } else if (part.type === "midi") {
          reference = playMIDI(reference as RefMIDI);
        }
      } else {
        // console.log("OPT1", part.type, part.transport);
        part.transport = transport;
        if (part.type === "audio") {
          reference = stopAudio(reference as RefAudio);
        }
      }
    } else {
      if (part.transport === Transport.PLAY) {
        part.transport = Transport.PAUSE;
        // console.log("OPT2", part.type, part.transport);
        if (part.type === "audio") {
          reference = stopAudio(reference as RefAudio);
        } else if (part.type === "midi") {
          reference = stopMIDI(reference as RefMIDI);
        }
      }
    }
    return [part, reference];
  });

  return [
    result.reduce((acc, [part]) => {
      acc[part.id] = part;
      return acc;
    }, {}),
    result.reduce((acc, [_, reference]) => {
      acc[reference.id] = reference;
      return acc;
    }, {}),
  ];
};

/*
// called when the project is not playing and the user updates the position of the playhead

export const setPartPosition = (partsById: { [id: string]: VAMPart }, position: number) => {
  let clone = { ...partsById };
  Object.values(clone).forEach(part => {
    const max = part.start + part.duration - part.trimStart + part.trimEnd;
    if (position >= part.start && position < max) {
      part.currentTime = position - part.start + part.trimStart;
    }
  });
};
*/
