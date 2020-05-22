import { RootState, Transport } from "../types";
import {
  SET_POSITION,
  SET_TRANSPORT,
  SET_PROGRESS,
  SONG_LOADED,
  ALBUM_LOADED,
  SELECT_TRACK,
  RESIZE,
  START_SEEK,
  STOP_SEEK,
  SEEK_POSITION,
} from "../constants";

export const rootReducer = (
  state: RootState,
  action: { type: string; payload: { [id: string]: any } }
): RootState => {
  if (action.type === ALBUM_LOADED) {
    const {
      payload: { tracks },
    } = action;
    return {
      ...state,
      loading: false,
      tracks: tracks,
      currentTrack: tracks[state.currentTrackIndex],
      // currentTrackDuration: tracks[state.currentTrackIndex].duration,
    };
  } else if (action.type === SONG_LOADED) {
    const {
      payload: { tracks, name, nameFriend, message },
    } = action;
    return {
      ...state,
      loading: false,
      tracks: tracks,
      currentTrack: tracks[state.currentTrackIndex],
      emailData: {
        sender: name,
        receiver: nameFriend,
        message,
      },
      // currentTrackDuration: tracks[state.currentTrackIndex].duration,
    };
  } else if (action.type === RESIZE) {
    const { width, height } = action.payload;
    return {
      ...state,
      width,
      height,
    };
  } else if (action.type === SELECT_TRACK) {
    console.log("select track");
    const {
      payload: { index, currentTrack },
    } = action;
    return {
      ...state,
      currentTrack: { ...currentTrack },
      currentTrackIndex: index,
      // isPlaying: true,
      // transport: Transport.PLAY,
      isPlaying: false,
      transport: Transport.STOP,
      playheadMillis: 0,
      playheadPixels: 0,
      // currentTrackDuration: state.tracks[index].duration,
    };
  } else if (action.type === SET_POSITION) {
    const {
      payload: { playheadMillis, playheadPixels, currentTrack, lastX },
    } = action;
    return {
      ...state,
      // isPlaying: false,
      // transport: Transport.STOP,
      lastX,
      currentTrack: { ...currentTrack },
      playheadMillis,
      playheadPixels,
    };
  } else if (action.type === SET_TRANSPORT) {
    const {
      payload: { transport, currentTrack },
    } = action;
    // console.log("REDUCER", transportAction);
    if (transport === Transport.STOP) {
      return {
        ...state,
        isPlaying: false,
        playheadMillis: 0,
        playheadPixels: 0,
        currentTrack: { ...currentTrack },
        transport,
      };
    } else if (transport === Transport.PAUSE) {
      return {
        ...state,
        isPlaying: false,
        currentTrack: { ...currentTrack },
        transport,
      };
    }
    return {
      ...state,
      isPlaying: true,
      currentTrack: { ...currentTrack },
      transport,
    };
  } else if (action.type === SET_PROGRESS) {
    // console.log(action.payload);
    const { playheadMillis, isPlaying, progress, transport } = action.payload;
    const p = playheadMillis / state.currentTrack.duration;
    return {
      ...state,
      playheadMillis,
      playheadPixels: p * state.width,
      isPlaying,
      progress,
      transport,
    };
  } else if (action.type === START_SEEK) {
    return {
      ...state,
      lastX: null,
      thumbX: action.payload.thumbX,
      wasPlaying: action.payload.wasPlaying,
      transport: Transport.STOP,
    };
  } else if (action.type === STOP_SEEK) {
    return {
      ...state,
      lastX: null,
      thumbX: null,
      isPlaying: state.wasPlaying,
      transport: state.wasPlaying ? Transport.PLAY : state.transport,
      wasPlaying: false,
      currentTrack: { ...action.payload.currentTrack },
    };
  } else if (action.type === SEEK_POSITION) {
    const {
      payload: { lastX, playheadMillis, playheadPixels },
    } = action;
    return {
      ...state,
      isPlaying: false,
      lastX,
      playheadMillis,
      playheadPixels,
    };
  }

  return state;
};
