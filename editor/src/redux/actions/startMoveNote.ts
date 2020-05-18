import { AnyAction } from "redux";
import { SyntheticEvent } from "react";
import { START_DRAW_NOTE, NO_ACTION_REQUIRED, START_MOVE_NOTE } from "../../constants";
import { getNativeEvent, getOffset, getPagePos } from "../../util/util";
import { RootState } from "../../types";
import { store } from "../store";

export const startMoveNote = (e: SyntheticEvent): AnyAction => {
  const target = e.target as HTMLDivElement;
  const n = getNativeEvent(e);
  const state = store.getState() as RootState;
  const { notes, ticksPerPixel } = state;

  // this x is the thumb!
  const { x, y } = getOffset(n);
  const { x: lastX, y: lastY } = getPagePos(n);

  const currentNote = notes.find(note => note.id === target.id);
  const filteredNotes = notes.filter(note => note.id !== target.id);
  // console.log(filteredNotes);

  return {
    type: START_MOVE_NOTE,
    payload: {
      lastX,
      lastY,
      currentNote,
      notes: filteredNotes,
      editAction: "moveNote",
    },
  };
};
