import { Dispatch } from "redux";
import { store } from "../store";
import { RootState, Transport } from "../../types";
import { stopMIDI, startMIDI } from "./action_utils";
import { SET_TRANSPORT } from "../../constants";

export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  const state = store.getState() as RootState;
  const { playheadMillis: playheadPosition, currentTrack } = state;
  let track = currentTrack;
  if (currentTrack !== null) {
    if (transport === Transport.STOP) {
      track = stopMIDI(currentTrack);
    } else if (transport === Transport.PLAY) {
      track = startMIDI(currentTrack, playheadPosition);
    }
  }
  dispatch({
    type: SET_TRANSPORT,
    payload: {
      transport,
      currentTrack: track,
    },
  });
};
