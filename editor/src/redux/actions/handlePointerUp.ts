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
import { RootState } from "../../types";
import { createMIDIEventsFromNotes } from "../../util/midi_utils";

export const handlePointerUp = (): AnyAction => {
  const state = store.getState() as RootState;
  const { editAction, songData, notes, currentNote } = state;

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

  const trackId = songData.song.tracks[0].id;
  const newNotes = [...notes, currentNote];
  const events = createMIDIEventsFromNotes(
    newNotes,
    songData.noteMapping,
    songData.millisPerTick,
    trackId
  );
  // console.log(events);
  let type = "";
  if (editAction === DRAW_NOTE) {
    type = STOP_DRAW_NOTE;
  } else if (editAction === MOVE_NOTE) {
    type = STOP_MOVE_NOTE;
  } else if (editAction === RESIZE_NOTE) {
    type = STOP_RESIZE_NOTE;
  }

  // console.log(events);
  return {
    type,
    payload: {
      notes: newNotes,
      songData: {
        ...songData,
        song: {
          ...songData.song,
          events,
        },
      },
    },
  };
};
