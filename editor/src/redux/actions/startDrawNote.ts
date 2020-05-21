import { AnyAction } from "redux";
import { SyntheticEvent } from "react";
import { START_DRAW_NOTE, DRAW_NOTE } from "../../constants";
import { getNativeEvent, getOffset, getPagePos } from "../../util/util";
import { RootState } from "../../types";
import { store } from "../store";

export const startDrawNote = (e: SyntheticEvent): AnyAction => {
  const target = e.target as HTMLDivElement;
  const n = getNativeEvent(e);
  n.stopPropagation();
  const state = store.getState() as RootState;
  const {
    ticksPerPixel,
    noteIndex,
    songData: {
      song: { ppq },
    },
  } = state;

  // this x is the thumb!
  const { x, y } = getOffset(n);
  const { x: lastX, y: lastY } = getPagePos(n);

  return {
    type: START_DRAW_NOTE,
    payload: {
      lastX,
      lastY,
      editAction: DRAW_NOTE,
      currentNote: {
        id: `note-${noteIndex}`,
        ticks: x / ticksPerPixel,
        noteNumber: parseInt(target.id.replace("row-", ""), 10),
        duration: ppq / 4,
      },
      noteIndex: noteIndex + 1,
    },
  };
};
