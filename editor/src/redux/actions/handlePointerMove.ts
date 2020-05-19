import { SyntheticEvent } from "react";
import { store } from "../store";
import { getNativeEvent, getPagePos } from "../../util/util";
import { RootState, Transport } from "../../types";
import {
  NO_ACTION_REQUIRED,
  MOVE_PLAYHEAD,
  DRAW_NOTE,
  MOVE_NOTE,
  REMOVE_NOTE,
  RESIZE_NOTE,
} from "../../constants";
import { AnyAction, Dispatch } from "redux";
import { createMIDIEventsFromNotes } from "./action_utils";

export const handlePointerMove = (e: SyntheticEvent): AnyAction => {
  const n = getNativeEvent(e);
  const { x, y } = getPagePos(n);
  const state = store.getState() as RootState;
  const {
    lastX,
    lastY,
    startX,
    startY,
    editAction,
    zoomLevel,
    ticksPerPixel,
    millisPerPixel,
    playheadPixels,
    currentNote,
    noteHeight,
    numNotes,
    notes,
    songData,
  } = state;

  const diffX = lastX !== null ? x - lastX : 0;
  const diffY = lastY !== null ? y - lastY : 0;
  const clone = { ...currentNote };

  if (editAction === null || editAction === "") {
    return {
      type: NO_ACTION_REQUIRED,
    };
  } else if (editAction === MOVE_PLAYHEAD) {
    const newPos = playheadPixels + diffX;
    const millis = newPos / millisPerPixel / zoomLevel;
    // console.log(newPos);
    return {
      type: MOVE_PLAYHEAD,
      payload: { lastX: x, newPos, millis },
    };
  } else if (editAction === DRAW_NOTE) {
    // console.log(diffX, diffY);
    const duration = (currentNote.duration * ticksPerPixel + diffX) / ticksPerPixel;
    // console.log(duration);
    clone.duration = duration;
    return {
      type: DRAW_NOTE,
      payload: { lastX: x, lastY: y, currentNote: clone },
    };
  } else if (editAction === MOVE_NOTE) {
    // console.log(diffX, diffY);
    const ticks = (currentNote.ticks * ticksPerPixel + diffX) / ticksPerPixel;
    const yPos = currentNote.originalNoteNumber * noteHeight - (startY - lastY);
    clone.ticks = ticks;
    clone.noteNumber = Math.floor(yPos / noteHeight);
    if (clone.noteNumber < 0 || clone.noteNumber >= numNotes) {
      const trackId = songData.song.tracks[0].id;
      const events = createMIDIEventsFromNotes(
        [...notes, currentNote],
        songData.millisPerTick,
        trackId
      );

      return {
        type: REMOVE_NOTE,
        payload: {
          notes: notes.filter(note => note.id !== currentNote.id),
          songData: {
            ...songData,
            song: {
              ...songData.song,
              events,
            },
          },
        },
      };
    }
    return {
      type: MOVE_NOTE,
      payload: { lastX: x, lastY: y, currentNote: clone },
    };
  } else if (editAction === RESIZE_NOTE) {
    // console.log(diffX, diffY);
    const duration = (currentNote.duration * ticksPerPixel + diffX) / ticksPerPixel;
    clone.duration = duration;
    return {
      type: RESIZE_NOTE,
      payload: { lastX: x, lastY: y, currentNote: clone },
    };
  }

  return {
    type: NO_ACTION_REQUIRED,
  };
};
