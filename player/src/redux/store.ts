import uniquid from "uniquid";
import { Observable, Subscriber } from "rxjs";
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
  tracks: [],
  currentTrack: null,
  currentTrackIndex: 0,
  thumbX: null,
  lastX: null,
  wasPlaying: false,
  emailData: null,
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
