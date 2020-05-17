import { SyntheticEvent } from "react";
import { store } from "../store";
import { getNativeEvent, getPagePos } from "../../util/util";
import { RootState, Transport } from "../../types";
import {
  DO_EDIT,
  NO_ACTION_REQUIRED,
  SEEK_POSITION,
  MOVE_PLAYHEAD,
  START_EDIT_NOTE,
  ADD_BAR,
} from "../../constants";
import { AnyAction, Dispatch } from "redux";
import { getOffset, getClientPos } from "../../util/util";
import { SET_POSITION, START_EDIT, STOP_EDIT } from "../../constants";
import { editPart, getEditAction, getInfo } from "./part_utils";
import { processTransportParts } from "../../process_parts";

export const handlePointerMove = (e: SyntheticEvent): AnyAction => {
  const n = getNativeEvent(e);
  const { x } = getPagePos(n);
  const state = store.getState() as RootState;
  const {
    editData: { action, lastX },
    zoomLevel,
    millisPerPixel,
    playheadPixels,
  } = state;

  const diffX = lastX !== null ? x - lastX : 0;

  if (action === null) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  } else if (action === MOVE_PLAYHEAD) {
    const newPos = playheadPixels + diffX;
    const millis = newPos / millisPerPixel / zoomLevel;
    // console.log(newPos);
    return {
      type: SEEK_POSITION,
      payload: { lastX: x, newPos, millis },
    };
  } else if (action === "drawNote") {
  }

  return {
    type: DO_EDIT,
    payload: { lastX: x, ...editPart(diffX, state) },
  };
};

export const handlePointerDown = (e: SyntheticEvent): AnyAction => {
  const target = (e.target as HTMLDivElement).className;
  const currentTarget = (e.currentTarget as HTMLDivElement).className;
  const n = getNativeEvent(e);
  const state = store.getState() as RootState;
  const {
    editorScrollPos,
    zoomLevel,
    millisPerPixel,
    notes,
    numBars,
    numerator,
    denominator,
    ppq,
  } = state;

  if (currentTarget === "time-ticks") {
    const newPos = getClientPos(n).x + editorScrollPos;
    const millis = newPos / millisPerPixel / zoomLevel;

    return {
      type: SET_POSITION,
      payload: {
        id: currentTarget,
        newPos,
        millis,
      },
    };
  }

  // this x is the thumb!
  const { x } = getOffset(n);

  if (currentTarget === "playhead") {
    return {
      type: START_EDIT,
      payload: {
        id: currentTarget,
        x,
        action: MOVE_PLAYHEAD,
      },
    };
  }

  // const ticksPerPixel = (width * zoomLevel) / (numBars * numerator * denominator * ppq);

  return {
    type: START_EDIT_NOTE,
    payload: {
      id: target,
      x,
      action: target === "piano-roll-notes" ? "drawNote" : "moveNote",
      currentNote: {
        id: `note-${notes.length}`,
        x,
      },
    },
  };
};

export const handlePointerUp = (): AnyAction => {
  const state = store.getState() as RootState;
  const {
    editData: { thumbX },
  } = state;

  return {
    type: thumbX === null ? NO_ACTION_REQUIRED : STOP_EDIT,
  };
};
