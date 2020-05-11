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
  width: window.innerWidth,
  height: window.innerHeight,
  isPlaying: false,
  playheadPosition: 0,
  transport: Transport.STOP,
  ListData: [],
  currentMIDIFileIndex: 0,
  progress: 0,
  sliderProps: {
    max: 100,
    min: 0,
    value: 0,
    id: `slider-${Date.now()}`,
    label: "",
    onChange: () => {},
    onInput: ()=> {},
    step: 0.1,
    type: "song-position",
    disabled: false,
  }
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
