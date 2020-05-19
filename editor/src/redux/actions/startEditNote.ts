import { AnyAction } from "redux";
import { SyntheticEvent } from "react";
import { START_MOVE_NOTE, START_RESIZE_NOTE, RESIZE_NOTE, MOVE_NOTE } from "../../constants";
import { getNativeEvent, getOffset, getPagePos } from "../../util/util";
import { RootState } from "../../types";
import { store } from "../store";

export const startEditNote = (e: SyntheticEvent): AnyAction => {
  const target = e.target as HTMLDivElement;
  const currentTarget = e.currentTarget as HTMLDivElement;
  const n = getNativeEvent(e);
  const state = store.getState() as RootState;
  const { notes, ticksPerPixel } = state;

  // this x is the thumb!
  const { x, y } = getOffset(n);
  const { x: lastX, y: lastY } = getPagePos(n);

  const currentNote = notes.find(note => note.id === target.id);
  const filteredNotes = notes.filter(note => note.id !== target.id);
  const thumbPosRel = x / (currentNote.duration * ticksPerPixel);

  if (thumbPosRel > 0.8) {
    return {
      type: START_RESIZE_NOTE,
      payload: {
        lastX,
        lastY,
        currentNote: { ...currentNote },
        notes: filteredNotes,
        editAction: RESIZE_NOTE,
      },
    };
  }

  return {
    type: START_MOVE_NOTE,
    payload: {
      lastX,
      lastY,
      currentNote: { ...currentNote, originalNoteNumber: currentNote.noteNumber },
      notes: filteredNotes,
      editAction: MOVE_NOTE,
    },
  };
};
