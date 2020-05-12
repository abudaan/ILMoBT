import { RootState, Transport } from "../types";
import {
  POINTER_MOVE,
  SET_POSITION,
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
  SELECT_TRACK,
  RESIZE,
  START_EDIT,
  STOP_EDIT,
  SEEK_POSITION,
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
  } else if (action.type === SET_POSITION) {
    const {
      payload: { playheadPosition, playheadPositionX, playheadPercentage, currentTrack, lastX },
    } = action;
    return {
      ...state,
      // isPlaying: false,
      // transport: Transport.STOP,
      lastX,
      currentTrack: { ...currentTrack },
      playheadPosition,
      playheadPositionX,
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
        playheadPositionX: 0,
        playheadPercentage: 0,
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
      playheadPositionX: playheadPercentage * state.width,
      isPlaying,
      progress,
    };
  } else if (action.type === START_EDIT) {
    return {
      ...state,
      lastX: null,
      thumbX: action.payload.thumbX,
    }
  } else if (action.type === STOP_EDIT) {
    return {
      ...state,
      lastX: null,
      thumbX: null,
    }
  } else if (action.type === SEEK_POSITION) {
    const {
      payload: { lastX, playheadPositionX, playheadPosition, playheadPercentage },
    } = action;
    return {
      ...state,
      isPlaying: false,
      transport: Transport.STOP,
      lastX,
      playheadPosition,
      playheadPositionX,
      playheadPercentage,
    };
  }

  return state;
};
