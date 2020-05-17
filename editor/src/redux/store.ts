import uniquid from "uniquid";
import { Observable, Subscriber } from "rxjs";
import { compose, applyMiddleware, createStore, Store, AnyAction } from "redux";
import { createLogger } from "redux-logger";
// import thunkMiddleware from "redux-thunk";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { rootReducer } from "./reducer";
import { RootState, Transport } from "../types";

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
  wasPlaying: false,
  numBars: 10,
  numNotes: 8,
  numerator: 4,
  denominator: 4,
  editData: {
    id: null,
    thumbX: null,
    lastX: null,
    action: null,
  },
  zoomLevel: 2,
  durationTimeline: 2000,
  millisPerPixel: window.innerWidth / 2000,
  editorScrollPos: 0,
  notes: [
    {
      id: "C1",
      ticks: 480,
      noteNumber: 3,
      duration: 480 * 4,
    },
  ],
  ppq: 960,
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
