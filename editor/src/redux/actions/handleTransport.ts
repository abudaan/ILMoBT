import { AnyAction } from "redux";
import { store } from "../store";
import { RootState, Transport } from "../../types";
import { stopMIDI, startMIDI, pauseMIDI, clock } from "../../util/midi_utils";
import { SET_TRANSPORT, NO_ACTION_REQUIRED } from "../../constants";
import { setProgress } from "./setProgress";

export const handleTransport = (t: Transport): AnyAction => {
  const state = store.getState() as RootState;
  const { playheadMillis, songData, transport } = state;
  if (transport === t) {
    return {
      type: NO_ACTION_REQUIRED,
    };
  }
  let sd = songData;
  if (t === Transport.STOP) {
    clock.stop();
    sd = stopMIDI(songData);
  } else if (t === Transport.PAUSE) {
    clock.stop();
    sd = pauseMIDI(songData);
  } else if (t === Transport.PLAY) {
    sd = startMIDI(songData, playheadMillis);
    clock.play(performance.now(), (progress: number) => {
      store.dispatch(setProgress(progress));
    });
  }

  return {
    type: SET_TRANSPORT,
    payload: {
      transport: t,
      songData: sd,
    },
  };
};
