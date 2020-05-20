import { Dispatch } from "redux";
import { store } from "../store";
import { RootState, Transport } from "../../types";
import { stopMIDI, startMIDI, pauseMIDI, clock } from "../../util/midi_utils";
import { SET_TRANSPORT } from "../../constants";
import { setProgress } from "./setProgress";

export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  const state = store.getState() as RootState;
  const { playheadMillis, songData } = state;
  let sd = songData;
  if (transport === Transport.STOP) {
    clock.stop();
    sd = stopMIDI(songData);
  } else if (transport === Transport.PAUSE) {
    clock.stop();
    sd = pauseMIDI(songData);
  } else if (transport === Transport.PLAY) {
    sd = startMIDI(songData, playheadMillis);
    clock.play(performance.now(), (progress: number) => {
      dispatch(setProgress(progress));
    });
  }

  dispatch({
    type: SET_TRANSPORT,
    payload: {
      transport,
      songData: sd,
    },
  });
};
