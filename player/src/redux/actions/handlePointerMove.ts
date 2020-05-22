import { SyntheticEvent } from "react";
import { AnyAction } from "redux";
import { store } from "../store";
import { RootState } from "../../types";
import { NO_ACTION_REQUIRED, SEEK_POSITION } from "../../constants";
import { getNativeEvent, getPagePos } from "../../util/util";

export const handlePointerMove = (e: SyntheticEvent): AnyAction => {
  const state = store.getState() as RootState;
  const { thumbX, lastX, width, currentTrack, playheadPixels } = state;

  if (thumbX === null) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  }
  const n = getNativeEvent(e);
  const { x } = getPagePos(n);
  const diffX = lastX !== null ? x - lastX : 0;
  return {
    type: SEEK_POSITION,
    payload: {
      lastX: x,
      playheadPixels: playheadPixels + diffX,
      playheadMillis: (playheadPixels / width) * currentTrack.duration,
    },
  };
};
