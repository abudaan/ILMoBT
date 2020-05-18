import { AnyAction } from "redux";
import { SyntheticEvent } from "react";
import { START_EDIT_NOTE } from "../../constants";
import { getNativeEvent, getOffset } from "../../util/util";
import { RootState } from "../../types";
import { store } from "../store";

export const startDrawNote = (e: SyntheticEvent): AnyAction => {
  const target = e.target as HTMLDivElement;
  const n = getNativeEvent(e);
  const state = store.getState() as RootState;
  const { editorScrollPos, zoomLevel, millisPerPixel, notes, ticksPerPixel, numNotes } = state;

  // this x is the thumb!
  const { x, y } = getOffset(n);

  //   console.log(target);

  return {
    type: START_EDIT_NOTE,
    payload: {
      id: target,
      x,
      action: target.className !== "note" ? "drawNote" : "moveNote",
      currentNote: {
        id: `note-${notes.length}`,
        ticks: x / ticksPerPixel,
        noteNumber: parseInt(target.id.replace("row-", ""), 10),
        duration: 960,
      },
    },
  };
};
