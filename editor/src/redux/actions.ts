import { SyntheticEvent } from "react";
import { store } from "./store";
import { outputs, midiAccess } from "../media";
import { RootState, Transport, RefMIDI } from "../types";
import {
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
  SELECT_TRACK,
  SET_POSITION,
  STOP_SEEK,
  START_SEEK,
  NO_ACTION_REQUIRED,
  SEEK_POSITION,
  SCROLL_ARRANGER,
  STOP_EDIT,
} from "../constants";
import { Dispatch, AnyAction } from "redux";
import { stopMIDI, startMIDI, playMIDI } from "./action_utils";
import { getNativeEvent, getPagePos, getClientPos, getOffset } from "../util/util";
import { unschedule } from "../../../webdaw/unschedule";

export const stopInteractivity = () => {
  const state = store.getState() as RootState;
  const { wasPlaying, currentTrack, playheadMillis } = state;
  let track = currentTrack;
  if (wasPlaying) {
    track = startMIDI(track, playheadMillis);
  }
  return {
    type: STOP_SEEK,
    payload: {
      currentTrack: track,
    },
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
  unschedule(currentTrack.song, midiAccess.outputs);
  const n = getNativeEvent(e);
  const x = getOffset(n).x;
  const millis = (x / width) * currentTrack.duration;
  const track = startMIDI(currentTrack, millis);

  return {
    type: SET_POSITION,
    payload: {
      playheadMillis: (x / width) * currentTrack.duration,
      playheadPixels: x,
      currentTrack: track,
    },
  };
};

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const { playheadMillis, currentTrack, transport } = state;
  const millis = playheadMillis + progress;
  let track = currentTrack;
  if (currentTrack !== null && millis < currentTrack.duration) {
    track = playMIDI(track);
    return {
      type: SET_PROGRESS,
      payload: {
        progress,
        transport,
        playheadMillis: millis,
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
      playheadMillis: 0,
      isPlaying: false,
      // currentTrack: track,
    },
  };
};

export const selectTrack = (index: number) => {
  const state = store.getState() as RootState;
  const { tracks, currentTrack } = state;
  stopMIDI(currentTrack);
  const track = startMIDI(tracks[index], 0);
  return {
    type: SELECT_TRACK,
    payload: {
      index,
      currentTrack: track,
    },
  };
};

export const scrollArranger = (scroll: number): AnyAction => {
  return {
    type: SCROLL_ARRANGER,
    payload: { scroll },
  };
};
