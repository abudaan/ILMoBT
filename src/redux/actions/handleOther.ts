import { SyntheticEvent } from "react";
import { store } from "../store";
import { RootState, Transport, ListData, ListDataJSON } from "../../types";
import {
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
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
    transport,
  } = state;
  const millis = playheadPosition + progress;
  // if (millis >= durationTimeline) {
  //   const x = durationTimeline * millisPerPixel * zoomLevel;
  //   return {
  //     type: SET_PROGRESS,
  //     payload: { x, millis: durationTimeline, isPlaying: false },
  //   };
  // }
  // const x = millis * millisPerPixel * zoomLevel;
  // const [partsById1, referencesById1] = processPositionParts(
  //   partsById,
  //   referencesById,
  //   millis,
  //   transport
  // );
  // if (playheadPosition >= partsById.video.start) {
  //   const video: HTMLVideoElement = (referencesById["video"] as RefVideo).videoElement;
  //   video.play();
  // }
  return {
    type: SET_PROGRESS,
    payload: {
      // x,
      millis,
      progress,
      isPlaying: true,
    },
  };
};

export const loadJSON = (url: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  const d = await fetchJSON(url);
  const v = Object.values(d);
  const r = await Promise.all(v.map(ld => fetchArraybuffer(ld.url)));
  const s = await Promise.all(r.map(ab => createSongFromMIDIFile(ab)))
  const files = s.map((song:Song, i: number) => {
    const duration = song.events[song.events.length - 1].millis;
    return {
      title: v[i].title,
      song,
      duration,
    };
  });
  console.log(files);
  dispatch({
    type: JSON_LOADED,
    payload: {
      files,
    },
  });
}