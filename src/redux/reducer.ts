import { RootState, Transport } from "../types";
import {
  POINTER_MOVE,
  SET_POSITION,
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
  SELECT_TRACK,
  RESIZE,
} from "../constants";

export const rootReducer = (
  state: RootState,
  action: { type: string; payload: { [id: string]: any } }
): RootState => {
  if (action.type === JSON_LOADED) {
    const { payload: { tracks } } = action;
    return {
      ...state,
      loading: false,
      tracks: tracks,
      currentTrack: tracks[state.currentTrackIndex],
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
    const { payload: { index, currentTrack } } = action;
    return {
      ...state,
      currentTrack: { ...currentTrack },
      currentTrackIndex: index,
      isPlaying: false,
      transport: Transport.STOP,
      playheadPosition: 0,
      playheadPercentage: 0,
      // currentTrackDuration: state.tracks[index].duration,
    };
  } else if (action.type === POINTER_MOVE) {
    return {
      ...state,
    };
  } else if (action.type === SET_POSITION) {
    const {
      payload: { playheadPosition, playheadPercentage, currentTrack },
    } = action;
    return {
      ...state,
      // isPlaying: false,
      // transport: Transport.STOP,
      currentTrack: { ...currentTrack },
      playheadPosition,
      playheadPercentage,
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
        playheadPosition: 0,
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
    const { playheadPosition, playheadPercentage, isPlaying, progress } = action.payload;
    return {
      ...state,
      playheadPercentage,
      playheadPosition,
      isPlaying,
      progress,
    };
  }

  return state;
};
