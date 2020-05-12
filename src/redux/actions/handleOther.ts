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
} from "../../constants";
import { Dispatch, AnyAction } from "redux";
import { fetchJSON, fetchArraybuffer } from "../../webdaw/fetch_helpers";
import { createSongFromMIDIFile } from "../../webdaw/sugar_coating";
import { stopMIDI, startMIDI, playMIDI } from "./action_utils";
import { getNativeEvent, getPagePos, getClientPos, getOffset } from "../../util/util";


export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  const state = store.getState() as RootState;
  const {
    playheadPosition,
    currentTrack,
  } = state;
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
}

export const handlePointerMove = (e: SyntheticEvent): AnyAction => {
  const state = store.getState() as RootState;
  const { thumbX, lastX, width, currentTrack,playheadPositionX } = state;

  if (thumbX === null) {
    return {
      type: NO_ACTION_REQUIRED
    }
  }
  const n = getNativeEvent(e);
  const { x } = getPagePos(n);
  const diffX = lastX !== null ? x - lastX : 0;
  return {
    type: SEEK_POSITION,
    payload: {
      lastX: x,
      playheadPositionX: playheadPositionX + diffX ,
      playheadPercentage: playheadPositionX / width,
      playheadPosition: (playheadPositionX / width) * currentTrack.duration,
    }
  }
}

export const startSeek = (e: SyntheticEvent) => {
  const n = getNativeEvent(e);
  const x = getClientPos(n).x;
  // console.log(x);
  return {
    type: START_EDIT,
    payload: {
      thumbX: x
    }
  }
}

export const stopInteractivity = () => {
  return {
    type: STOP_EDIT,
  }
}

export const setPosition = (e: SyntheticEvent) => {
  const state = store.getState() as RootState;
  const {
    currentTrack,
    width,
  } = state;
  const id = (e.target as HTMLDivElement).id;
  if (id !== "slider") {
    return {
      type: NO_ACTION_REQUIRED,
    }
  }
  const n = getNativeEvent(e);
  const x = getOffset(n).x;
  const millis = (x / width) * currentTrack.duration;
  const track = startMIDI(currentTrack, millis);

  return ({
    type: SET_POSITION,
    payload: {
      playheadPosition: (x / width) * currentTrack.duration,
      playheadPositionX: x,
      playheadPercentage: x / width,
      currentTrack: track,
    },
  });
}

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const {
    playheadPosition,
    currentTrack,
    transport,
  } = state;
  const millis = playheadPosition + progress;
  const perc = millis / currentTrack.duration;
  let track = currentTrack;
  if (currentTrack !== null && millis < currentTrack.duration) {
    track = playMIDI(track);
    return {
      type: SET_PROGRESS,
      payload: {
        progress,
        transport,
        playheadPercentage: perc,
        playheadPosition: millis,
        isPlaying: true,
      },
    };
  }
  return {
    type: SET_PROGRESS,
    payload: {
      progress,
      transport: Transport.STOP,
      playheadPercentage: 0,
      playheadPosition: 0,
      isPlaying: false,
    },
  };
};

export const selectTrack = (index: number) => {
  const state = store.getState() as RootState;
  const {
    tracks,
  } = state;
  const track = stopMIDI(tracks[index]);
  return {
    type: SELECT_TRACK,
    payload: {
      index,
      currentTrack: track,
    }
  }
}

export const loadJSON = (url: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  const d = await fetchJSON(url);
  const v = Object.values(d);
  const r = await Promise.all(v.map(ld => fetchArraybuffer(ld.url)));
  const t = await Promise.all(r.map(async (ab, i: number): Promise<RefMIDI> => {
    const song = await createSongFromMIDIFile(ab);
    const duration = song.events[song.events.length - 1].millis;
    song.tracks.forEach(track => {
      track.outputs.push(...outputs.map(o => o.id));
    });
    const reference: RefMIDI = { id: `song-${i}`, title: v[i].title, song, timestamp: 0, millis: 0, index: 0, scheduled: [], duration };
    return reference;
  }))

  dispatch({
    type: JSON_LOADED,
    payload: {
      tracks: t,
    }
  });
}

