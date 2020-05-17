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
  ZOOM_LEVEL,
  SEEK_ZOOM_LEVEL,
  ADD_BAR,
  REMOVE_BAR,
  START_EDIT_NOTE,
} from "../constants";

export const rootReducer = (
  state: RootState,
  action: { type: string; payload: { [id: string]: any } }
): RootState => {
  if (action.type === JSON_LOADED) {
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
  } else if (action.type === RESIZE) {
    const { width, height } = action.payload;
    return {
      ...state,
      width,
      height,
    };
  } else if (action.type === SELECT_TRACK) {
    const {
      payload: { index, currentTrack },
    } = action;
    return {
      ...state,
      currentTrack: { ...currentTrack },
      currentTrackIndex: index,
      isPlaying: false,
      transport: Transport.STOP,
      playheadMillis: 0,
      playheadPixels: 0,
      // currentTrackDuration: state.tracks[index].duration,
    };
  } else if (action.type === SET_POSITION) {
    const {
      payload: { playheadPosition, playheadPositionX, currentTrack, lastX },
    } = action;
    return {
      ...state,
      // isPlaying: false,
      // transport: Transport.STOP,
      lastX,
      currentTrack: { ...currentTrack },
      playheadMillis: playheadPosition,
      playheadPixels: playheadPositionX,
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
    const { playheadPosition, isPlaying, progress, transport } = action.payload;
    const p = playheadPosition / state.currentTrack.duration;
    return {
      ...state,
      playheadMillis: playheadPosition,
      playheadPixels: p * state.width,
      isPlaying,
      progress,
      transport,
    };
  } else if (action.type === START_EDIT) {
    return {
      ...state,
      lastX: null,
      thumbX: action.payload.thumbX,
    };
  } else if (action.type === STOP_EDIT) {
    return {
      ...state,
      lastX: null,
      thumbX: null,
      notes: [...state.notes, { ...state.currentNote }],
      currentNote: null,
    };
  } else if (action.type === SEEK_POSITION) {
    const {
      payload: { lastX, playheadPositionX, playheadPosition },
    } = action;
    return {
      ...state,
      isPlaying: false,
      transport: Transport.STOP,
      lastX,
      playheadMillis: playheadPosition,
      playheadPixels: playheadPositionX,
    };
  } else if (action.type === ZOOM_LEVEL) {
    const { zoomLevel } = action.payload;
    return {
      ...state,
      zoomLevel,
      ticksPerPixel:
        (state.width * zoomLevel) /
        (state.numBars * state.numerator * state.denominator * state.ppq),
    };
  } else if (action.type === SEEK_ZOOM_LEVEL) {
    return {
      ...state,
      seekZoomLevel: action.payload.zoom,
    };
  } else if (action.type === ADD_BAR) {
    const numBars = state.numBars + 1;
    return {
      ...state,
      numBars,
      ticksPerPixel:
        (state.width * state.zoomLevel) /
        (numBars * state.numerator * state.denominator * state.ppq),
    };
  } else if (action.type === REMOVE_BAR) {
    const numBars = state.numBars - 1;
    return {
      ...state,
      numBars,
      ticksPerPixel:
        (state.width * state.zoomLevel) /
        (numBars * state.numerator * state.denominator * state.ppq),
    };
  } else if (action.type === START_EDIT_NOTE) {
    return {
      ...state,
      currentNote: { ...action.payload.currentNote },
      // notes: [...state.notes, action.payload.currentNote],
    };
  }

  return state;
};