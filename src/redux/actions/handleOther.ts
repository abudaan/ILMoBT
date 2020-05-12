import { store } from "../store";
import { outputs } from "../../media";
import { RootState, Transport, RefMIDI } from "../../types";
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
import { stopMIDI, startMIDI, playMIDI } from "./action_utils";

export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  const state = store.getState() as RootState;
  const {
    playheadPosition,
    currentTrack,
  } = state;
  let track = currentTrack;
  if(currentTrack !== null) {
    if(transport === Transport.STOP) {
      track = stopMIDI(currentTrack);
    } else  if(transport === Transport.PLAY) {
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

export const setProgress = (progress: number) => {
  const state = store.getState() as RootState;
  const {
    playheadPosition,
    currentTrack,
    transport,
  } = state;
  const millis = playheadPosition + progress;
  const perc = (millis / currentTrack.duration * 100);
  let track = currentTrack;
  if(currentTrack !== null && millis < currentTrack.duration) {
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

