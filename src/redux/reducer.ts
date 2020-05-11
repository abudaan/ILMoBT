import { RootState, Transport } from "../types";
import {
  POINTER_MOVE,
  SET_POSITION,
  SET_TRANSPORT,
  SET_PROGRESS,
  JSON_LOADED,
} from "../constants";

export const rootReducer = (
  state: RootState,
  action: { type: string; payload: { [id: string]: any } }
): RootState => {
  // if (
  //   action.type !== SET_PROGRESS &&
  //   action.type !== DO_EDIT &&
  //   action.type !== NO_ACTION_REQUIRED
  // ) {
  //   console.log("[ACTION]", action.type, action.payload);
  // }
  if (action.type === JSON_LOADED) {
    return {
      ...state,
      loading: false,
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
    // console.log(action.payload.partsById["audio-0"].transport);
    return {
      ...state,
      playheadPosition: action.payload.millis,
      isPlaying: action.payload.isPlaying,
      progress: action.payload.progress,
    };
  }

  return state;
};
