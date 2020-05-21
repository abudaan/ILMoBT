import { RootState, Transport } from "../types";
import {
  SET_POSITION,
  SET_TRANSPORT,
  SET_PROGRESS,
  RESIZE,
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
  STORE_SONG,
  START_MOVE_PLAYHEAD,
  STOP_MOVE_PLAYHEAD,
  MOVE_PLAYHEAD,
  PANIC,
  CLEAR_SONG,
  SAVE_MIDI_FILE,
  SEND_TO_FRIEND,
  SET_FORM,
  SCROLL_EDITOR,
} from "../constants";

export const rootReducer = (
  state: RootState,
  action: { type: string; payload: { [id: string]: any } }
): RootState => {
  // console.log(action.type);
  if (action.type === RESIZE) {
    const { width, height } = action.payload;
    return {
      ...state,
      width,
      height,
      millisPerPixel: window.innerWidth / state.songData.song.durationMillis,
      ticksPerPixel: window.innerWidth / state.songData.song.durationTicks,
    };
  } else if (action.type === SET_POSITION) {
    const {
      payload: { playheadMillis, playheadPixels, songData, lastX },
    } = action;
    return {
      ...state,
      // isPlaying: false,
      // transport: Transport.STOP,
      lastX,
      songData,
      playheadMillis,
      playheadPixels,
    };
  } else if (action.type === SET_TRANSPORT) {
    const {
      payload: { transport, songData },
    } = action;
    // console.log("REDUCER", transportAction);
    if (transport === Transport.STOP) {
      return {
        ...state,
        isPlaying: false,
        playheadMillis: 0,
        playheadPixels: 0,
        songData,
        transport,
      };
    } else if (transport === Transport.PAUSE) {
      return {
        ...state,
        isPlaying: false,
        songData,
        transport,
      };
    }
    return {
      ...state,
      isPlaying: true,
      songData,
      transport,
    };
  } else if (action.type === SET_PROGRESS) {
    // console.log(action.payload);
    const {
      progress,
      transport,
      playheadMillis,
      playheadPixels,
      editorScrollPos,
      isPlaying,
      songData,
    } = action.payload;
    return {
      ...state,
      playheadMillis,
      playheadPixels,
      editorScrollPos,
      isPlaying,
      progress,
      transport,
      songData,
    };
  } else if (action.type === START_MOVE_PLAYHEAD) {
    return {
      ...state,
      wasPlaying: state.isPlaying,
      isPlaying: false,
      transport: Transport.PAUSE,
      editAction: MOVE_PLAYHEAD,
    };
  } else if (action.type === MOVE_PLAYHEAD) {
    const {
      payload: { lastX, playheadMillis, playheadPixels },
    } = action;
    return {
      ...state,
      isPlaying: false,
      transport: Transport.STOP,
      lastX,
      playheadMillis,
      playheadPixels,
    };
  } else if (action.type === ZOOM_LEVEL) {
    const { zoomLevel, ticksPerPixel } = action.payload;
    return {
      ...state,
      zoomLevel,
      ticksPerPixel,
    };
  } else if (action.type === SEEK_ZOOM_LEVEL) {
    return {
      ...state,
      seekZoomLevel: action.payload.zoom,
    };
  } else if (action.type === STORE_SONG) {
    return {
      ...state,
      songData: action.payload.songData,
    };
  } else if (action.type === ADD_BAR) {
    const {
      payload: { songData, ticksPerPixel },
    } = action;
    return {
      ...state,
      songData,
      ticksPerPixel,
    };
  } else if (action.type === REMOVE_BAR) {
    const {
      payload: { ticksPerPixel, notes, songData },
    } = action;
    return {
      ...state,
      ticksPerPixel,
      notes,
      songData,
    };
  } else if (action.type === START_DRAW_NOTE) {
    const { lastX, lastY, editAction, currentNote, noteIndex } = action.payload;
    return {
      ...state,
      currentNote,
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
      songData: action.payload.songData,
      notes: action.payload.notes,
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === STOP_MOVE_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      songData: action.payload.songData,
      notes: action.payload.notes,
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === STOP_RESIZE_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      songData: action.payload.songData,
      notes: action.payload.notes,
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === STOP_MOVE_PLAYHEAD) {
    const {
      payload: { transport },
    } = action;
    return {
      ...state,
      transport,
      wasPlaying: false,
      isPlaying: transport === Transport.PLAY,
      lastX: null,
      lastY: null,
      editAction: "",
    };
  } else if (action.type === REMOVE_NOTE) {
    return {
      ...state,
      lastX: null,
      lastY: null,
      songData: action.payload.songData,
      notes: action.payload.notes,
      currentNote: null,
      editAction: "",
    };
  } else if (action.type === PANIC) {
    // console.log("PANIQUE EN AFRIQUE");
    return {
      ...state,
      transport: Transport.STOP,
      playheadMillis: 0,
      playheadPixels: 0,
    };
  } else if (action.type === CLEAR_SONG) {
    const {
      payload: { notes, songData },
    } = action;
    return {
      ...state,
      notes,
      songData,
      transport: Transport.STOP,
      playheadMillis: 0,
      playheadPixels: 0,
    };
  } else if (action.type === SAVE_MIDI_FILE) {
    return {
      ...state,
      transport: Transport.STOP,
      playheadMillis: 0,
      playheadPixels: 0,
    };
  } else if (action.type === SEND_TO_FRIEND) {
    return {
      ...state,
      form: {
        name: "",
        email: "",
        nameFriend: "",
        emailFriend: "",
        message: "",
      },
      transport: Transport.STOP,
      playheadMillis: 0,
      playheadPixels: 0,
    };
  } else if (action.type === SET_FORM) {
    return {
      ...state,
      form: {
        ...state.form,
        ...action.payload,
      },
    };
  } else if (action.type === SCROLL_EDITOR) {
    return {
      ...state,
      editorScrollPos: action.payload.scrollLeft,
    };
  }
  return state;
};
