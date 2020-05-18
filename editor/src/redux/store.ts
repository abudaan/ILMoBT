import uniquid from "uniquid";
import { Observable, Subscriber } from "rxjs";
import { compose, applyMiddleware, createStore, Store, AnyAction } from "redux";
import { createLogger } from "redux-logger";
// import thunkMiddleware from "redux-thunk";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { rootReducer } from "./reducer";
import { RootState, Transport } from "../types";

const ppq = 960;
const numerator = 4;
const denominator = 4;
const numBars = 10;
const numNotes = 8;

const initialState: RootState = {
  loading: false,
  width: window.innerWidth,
  height: window.innerHeight,
  isPlaying: false,
  progress: 0,
  playheadMillis: 0,
  playheadPixels: 0,
  transport: Transport.STOP,
  tracks: [],
  currentTrack: null,
  currentTrackIndex: 0,
  thumbX: null,
  lastX: null,
  lastY: null,
  wasPlaying: false,
  numBars,
  numNotes,
  numerator,
  denominator,
  editData: {
    id: null,
    thumbX: null,
    lastX: null,
    action: null,
  },
  zoomLevel: 1,
  seekZoomLevel: 1,
  durationTimeline: 2000,
  millisPerPixel: window.innerWidth / 2000,
  ticksPerPixel: (window.innerWidth * 1) / (numBars * numerator * denominator * ppq),
  editorScrollPos: 0,
  notes: [
    {
      id: "n1",
      ticks: 960 * 16,
      noteNumber: 0,
      duration: 960 * 4,
    },
    {
      id: "n2",
      ticks: 960 * 50,
      noteNumber: 1,
      duration: 960 * 4,
    },
    {
      id: "n3",
      ticks: 960 * 150,
      noteNumber: 5,
      duration: 960 * 4,
    },
  ],
  ppq: 960,
  currentNote: null,
  noteHeight: 30,
  editAction: "",
};

// const store: Store<any, AnyAction> = createStore(
const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk as ThunkMiddleware<RootState, AnyAction>)
  // compose(applyMiddleware(thunkMiddleware, createLogger({ collapsed: true })))
);

const state$ = new Observable((observer: Subscriber<RootState>) => {
  observer.next(store.getState());
  const unsubscribe = store.subscribe(() => {
    observer.next(store.getState());
  });
  return unsubscribe;
});

const getState$ = (): Observable<RootState> => {
  return state$;
};

export { getState$, store };
