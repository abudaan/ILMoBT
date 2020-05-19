import { AnyAction } from "redux";
import { store } from "../store";
import {
  STOP_DRAW_NOTE,
  NO_ACTION_REQUIRED,
  STOP_MOVE_NOTE,
  STOP_RESIZE_NOTE,
  DRAW_NOTE,
  MOVE_NOTE,
  RESIZE_NOTE,
  MOVE_PLAYHEAD,
  STOP_MOVE_PLAYHEAD,
  REMOVE_NOTE,
} from "../../constants";
import { RootState, NoteUI } from "../../types";
import { MIDIEvent } from "../../../../webdaw/midi_events";
import { sortMIDIEvents } from "../../../../webdaw/midi_utils";

const createMIDIEvents = (notes: NoteUI[], millisPerTick): MIDIEvent[] => {
  const events: [MIDIEvent, MIDIEvent][] = notes.map(note => {
    const noteOn = {
      type: 0x80,
      descr: "note on",
      ticks: note.ticks,
      channel: 0,
      millis: note.ticks * millisPerTick,
      noteNumber: note.noteNumber,
      velocity: 100,
      trackId,
      part: "part1",
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
      part: "part1",
    };

    return [noteOn, noteOff];
  });
};

export const handlePointerUp = (): AnyAction => {
  const state = store.getState() as RootState;
  const { editAction, song, notes, currentNote } = state;

  console.log("Pointer Up", editAction);
  if (!editAction) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  } else if (editAction === MOVE_PLAYHEAD) {
    return {
      type: STOP_MOVE_PLAYHEAD,
    };
  }

  const millisPerTick = (60 / song.initialTempo / song.ppq) * 1000;
  const trackId = song.tracks[0].id;

  console.log(events.flat(1));

  const payload = {
    song: {
      ...song,
      events: sortMIDIEvents(events.flat(1)),
    },
  };
  if (editAction === DRAW_NOTE) {
    return {
      type: STOP_DRAW_NOTE,
      payload,
    };
  } else if (editAction === MOVE_NOTE) {
    return {
      type: STOP_MOVE_NOTE,
      payload,
    };
  } else if (editAction === RESIZE_NOTE) {
    return {
      type: STOP_RESIZE_NOTE,
      payload,
    };
  } else if (editAction === REMOVE_NOTE) {
    return {
      type: STOP_MOVE_NOTE,
      payload,
    };
  }
};
