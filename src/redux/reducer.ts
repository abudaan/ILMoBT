import { RootState, Transport } from "../types";
import {
  POINTER_MOVE,
  SET_POSITION,
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
  SELECT_TRACK,
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
      currentTrackDuration: tracks[state.currentTrackIndex].duration,
    };
  } else if (action.type === SELECT_TRACK) {
    return {
      ...state,
      currentTrackIndex: action.payload.index,
      currentTrackDuration: state.tracks[action.payload.index].duration,

    };
  } else if (action.type === POINTER_MOVE) {
    return {
      ...state,
    };
  } else if (action.type === SET_POSITION) {
    const {
      payload: { newPos, millis, id, partsById, referencesById },
    } = action;
    return {
      ...state,
      isPlaying: false,
      transport: Transport.STOP,
      playheadPosition: millis,
    };
  } else if (action.type === SET_TRANSPORT) {
    const {
      payload: { transport, partsById, referencesById },
    } = action;
    // console.log("REDUCER", transportAction);
    if (transport === Transport.STOP) {
      return {
        ...state,
        isPlaying: false,
        playheadPosition: 0,
        transport,
      };
    } else if (transport === Transport.PAUSE) {
      return {
        ...state,
        isPlaying: false,
        transport,
      };
    }
    return {
      ...state,
      isPlaying: true,
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
