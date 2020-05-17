import { SyntheticEvent } from "react";
import { store } from "../store";
import { outputs } from "../../media";
import { RootState, Transport, RefMIDI } from "../../types";
import {
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
  SELECT_TRACK,
  SET_POSITION,
  STOP_EDIT,
  START_EDIT,
  NO_ACTION_REQUIRED,
  SEEK_POSITION,
  ZOOM_LEVEL,
  SEEK_ZOOM_LEVEL,
  SCROLL_ARRANGER,
  ADD_BAR,
  REMOVE_BAR,
} from "../../constants";
import { Dispatch, AnyAction } from "redux";
import { fetchJSON, fetchArraybuffer } from "../../../../webdaw/fetch_helpers";
import { createSongFromMIDIFile } from "../../../../webdaw/sugar_coating";
import { stopMIDI, startMIDI, playMIDI } from "../action_utils";
import { getNativeEvent, getPagePos, getClientPos, getOffset } from "../../util/util";

export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  const state = store.getState() as RootState;
  const { playheadMillis: playheadPosition, currentTrack } = state;
  let track = currentTrack;
  if (currentTrack !== null) {
    if (transport === Transport.STOP) {
      track = stopMIDI(currentTrack);
    } else if (transport === Transport.PLAY) {
      track = startMIDI(currentTrack, playheadPosition);
    }
  }
  dispatch({
    type: SET_TRANSPORT,
    payload: {
      transport,
      currentTrack: track,
    },
  });
};

export const handlePointerMove = (e: SyntheticEvent): AnyAction => {
  const state = store.getState() as RootState;
  const { thumbX, lastX, width, currentTrack, playheadPixels: playheadPositionX } = state;

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
      playheadPositionX: playheadPositionX + diffX,
      playheadPosition: (playheadPositionX / width) * currentTrack.duration,
    },
  };
};

export const startSeek = (e: SyntheticEvent) => {
  const n = getNativeEvent(e);
  const x = getClientPos(n).x;
  // console.log(x);
  return {
    type: START_EDIT,
    payload: {
      thumbX: x,
    },
  };
};

export const stopInteractivity = () => {
  return {
    type: STOP_EDIT,
  };
};

export const setPosition = (e: SyntheticEvent) => {
  const state = store.getState() as RootState;
  const { currentTrack, width } = state;
  const id = (e.target as HTMLDivElement).id;
  if (id !== "slider") {
    return {
      type: NO_ACTION_REQUIRED,
    };
  }
  const n = getNativeEvent(e);
  const x = getOffset(n).x;
  const millis = (x / width) * currentTrack.duration;
  const track = startMIDI(currentTrack, millis);

  return {
    type: SET_POSITION,
    payload: {
      playheadPosition: (x / width) * currentTrack.duration,
      playheadPositionX: x,
      currentTrack: track,
    },
  };
};

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const { playheadMillis: playheadPosition, currentTrack, transport } = state;
  const millis = playheadPosition + progress;
  let track = currentTrack;
  if (currentTrack !== null && millis < currentTrack.duration) {
    track = playMIDI(track);
    return {
      type: SET_PROGRESS,
      payload: {
        progress,
        transport,
        playheadPosition: millis,
        isPlaying: true,
        // currentTrack: track,
      },
    };
  }
  track = stopMIDI(track);
  return {
    type: SET_PROGRESS,
    payload: {
      progress,
      transport: Transport.STOP,
      playheadPosition: 0,
      isPlaying: false,
      // currentTrack: track,
    },
  };
};

export const selectTrack = (index: number) => {
  const state = store.getState() as RootState;
  const { tracks, currentTrack } = state;
  stopMIDI(currentTrack);
  const track = stopMIDI(tracks[index]);
  return {
    type: SELECT_TRACK,
    payload: {
      index,
      currentTrack: track,
    },
  };
};
export const setZoomLevel = (zoom: number): AnyAction => {
  return {
    type: ZOOM_LEVEL,
    payload: { zoomLevel: zoom },
  };
};

export const seekZoomLevel = (zoom: number): AnyAction => {
  return {
    type: SEEK_ZOOM_LEVEL,
    payload: { zoom },
  };
};

export const scrollArranger = (scroll: number): AnyAction => {
  return {
    type: SCROLL_ARRANGER,
    payload: { scroll },
  };
};

export const addBar = () => {
  return {
    type: ADD_BAR,
  };
};
export const removeBar = () => {
  return {
    type: REMOVE_BAR,
  };
};
