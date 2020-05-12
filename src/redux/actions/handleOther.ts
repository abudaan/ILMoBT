import { SyntheticEvent } from "react";
import { store } from "../store";
import { RootState, Transport, Tracks, ListDataJSON } from "../../types";
import {
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
  SELECT_TRACK,
} from "../../constants";
import { Dispatch } from "redux";
import { fetchJSON, fetchArraybuffer } from "../../webdaw/fetch_helpers";
import { createSongFromMIDIFile } from "../../webdaw/sugar_coating";
import { Song } from "../../webdaw/types";

export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch({
    type: SET_TRANSPORT,
    payload: {
      transport,
    },
  });
}

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const {
    playheadPosition,
    currentTrackDuration,
  } = state;
  const millis = playheadPosition + progress;
  const perc = millis / currentTrackDuration;
  return {
    type: SET_PROGRESS,
    payload: {
      progress,
      playheadPercentage: perc,
      playheadPosition: millis,
      isPlaying: true,
    },
  };
};

export const selectTrack = (index: number) => {
  return {
    type: SELECT_TRACK,
    payload: {index}
  }
}

export const loadJSON = (url: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  const d = await fetchJSON(url);
  const v = Object.values(d);
  const r = await Promise.all(v.map(ld => fetchArraybuffer(ld.url)));
  const s = await Promise.all(r.map(ab => createSongFromMIDIFile(ab)))
  const tracks = s.map((song:Song, i: number) => {
    const duration = song.events[song.events.length - 1].millis;
    return {
      title: v[i].title,
      song,
      duration,
    };
  });
  console.log(tracks);
  dispatch({
    type: JSON_LOADED,
    payload: {
      tracks,
    },
  });
}