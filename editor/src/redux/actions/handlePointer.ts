import { SyntheticEvent } from "react";
import { store } from "../store";
import { getNativeEvent, getPagePos } from "../../util/util";
import { RootState, Transport, RefVideo } from "../../types";
import { DO_EDIT, NO_ACTION_REQUIRED, SEEK_POSITION, MOVE_PLAYHEAD } from "../../constants";
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
    playheadPixels: playheadPositionX,
    referencesById,
    partsById,
  } = state;

  const diffX = lastX !== null ? x - lastX : 0;
  const part = partsById["video"];

  if (action === null) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  } else if (action === MOVE_PLAYHEAD) {
    const newPos = playheadPositionX + diffX;
    const millis = newPos / millisPerPixel / zoomLevel;
    // console.log(newPos);
    (referencesById["video"] as RefVideo).videoElement.currentTime =
      (millis - part.start + part.trimStart) / 1000;
    return {
      type: SEEK_POSITION,
      payload: { lastX: x, newPos, millis },
    };
  }

  return {
    type: DO_EDIT,
    payload: { lastX: x, ...editPart(diffX, state) },
  };
};

export const handlePointerDown = (e: SyntheticEvent): AnyAction => {
  const id = (e.currentTarget as HTMLDivElement).id;
  const n = getNativeEvent(e);
  const state = store.getState() as RootState;
  const { arrangerScrollPos, zoomLevel, millisPerPixel, referencesById, partsById } = state;
  const video = (referencesById["video"] as RefVideo).videoElement;
  const part = partsById["video"];

  if (id === "time-ticks") {
    const newPos = getClientPos(n).x + arrangerScrollPos;
    const millis = newPos / millisPerPixel / zoomLevel;
    video.pause();
    video.currentTime = (millis - part.start + part.trimStart) / 1000;

    const [partsById1, referencesById1] = processTransportParts(
      partsById,
      referencesById,
      Transport.PAUSE
    );

    return {
      type: SET_POSITION,
      payload: {
        id,
        newPos,
        millis,
        partsById: partsById1,
        referencesById: referencesById1,
      },
    };
  }

  // this x is the thumb!
  const { x } = getOffset(n);

  if (id === "playhead") {
    video.pause();
    const [partsById1, referencesById1] = processTransportParts(
      partsById,
      referencesById,
      Transport.PAUSE
    );
    return {
      type: START_EDIT,
      payload: {
        id,
        x,
        action: MOVE_PLAYHEAD,
        partsById: partsById1,
        referencesById: referencesById1,
      },
    };
  }

  return {
    type: START_EDIT,
    payload: {
      id,
      x,
      action: getEditAction(x, id, state),
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
