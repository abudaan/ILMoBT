// import uniquid from "uniquid";
// import { Observable, Subscriber } from "rxjs";
import { compose, applyMiddleware, createStore, Store, AnyAction } from "redux";
import { createLogger } from "redux-logger";
// import thunkMiddleware from "redux-thunk";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { rootReducer } from "./reducer";
import { RootState, Transport } from "../types";

const initialState: RootState = {
  loading: true,
  width: 0,
  height: 0,
  isPlaying: false,
  progress: 0,
  playheadMillis: 0,
  playheadPixels: 0,
  transport: Transport.STOP,
  songData: null,
  startX: null,
  startY: null,
  lastX: null,
  lastY: null,
  wasPlaying: false,
  zoomLevel: 1,
  seekZoomLevel: 1,
  millisPerPixel: 0,
  ticksPerPixel: 0,
  editorScrollPos: 0,
  notes: [],
  currentNote: null,
  noteHeight: 30,
  editAction: "",
  noteIndex: 0, // every time a note is created the index increases
  form: {
    name: "",
    email: "",
    nameFriend: "",
    emailFriend: "",
    message: "",
    feedbackMessage: "",
  },
};

// const store: Store<any, AnyAction> = createStore(
export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunk as ThunkMiddleware<RootState, AnyAction>)
  // compose(applyMiddleware(thunkMiddleware, createLogger({ collapsed: true })))
);

/*
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
*/
