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
  START_DRAW_NOTE,
  DRAW_NOTE,
  STOP_DRAW_NOTE,
  START_MOVE_NOTE,
  MOVE_NOTE,
  STOP_MOVE_NOTE,
  REMOVE_NOTE,
  START_RESIZE_NOTE,
  STOP_RESIZE_NOTE,
  RESIZE_NOTE,
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
  } else if (action.type === START_DRAW_NOTE) {
    const { lastX, lastY, editAction, currentNote, noteIndex } = action.payload;
    return {
      ...state,
      currentNote: { ...currentNote },
      editAction,
      lastX,
      lastY,
      noteIndex,
      startX: lastX,
      startY: lastY,
    };
  } else if (action.type === START_MOVE_NOTE) {
    const { lastX, lastY, editAction, currentNote, notes } = action.payload;
    return {
      ...state,
      notes: [...notes],
      currentNote: { ...currentNote },
      editAction,
      lastX,
      lastY,
      startX: lastX,
      startY: lastY,
    };
  } else if (action.type === START_RESIZE_NOTE) {
    const { lastX, lastY, editAction, currentNote, notes } = action.payload;
    return {
      ...state,
      notes: [...notes],
      currentNote: { ...currentNote },
      editAction,
      lastX,
      lastY,
      startX: lastX,
      startY: lastY,
    };
  } else if (action.type === DRAW_NOTE) {
    const { lastX, lastY, currentNote } = action.payload;
    return {
      ...state,
      currentNote: { ...currentNote },
      lastX,
      lastY,
    };
  } else if (action.type === MOVE_NOTE) {
    const { lastX, lastY, currentNote } = action.payload;
    return {
      ...state,
      currentNote: { ...currentNote },
      lastX,
      lastY,
    };
  } else if (action.type === RESIZE_NOTE) {
    const { lastX, lastY, currentNote } = action.payload;
    return {
      ...state,
      currentNote: { ...currentNote },
      lastX,
      lastY,
    };
  } else if (action.type === STOP_DRAW_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      thumbX: null,
      notes: [...state.notes, { ...state.currentNote }],
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === STOP_MOVE_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      thumbX: null,
      notes: [...state.notes, { ...state.currentNote }],
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === STOP_RESIZE_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      thumbX: null,
      notes: [...state.notes, { ...state.currentNote }],
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === REMOVE_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      notes: action.payload.notes,
      currentNote: null,
      editAction: "",
    };
  }
  return state;
};
