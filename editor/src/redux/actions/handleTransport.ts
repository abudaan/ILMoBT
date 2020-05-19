import { Dispatch } from "redux";
import { store } from "../store";
import { RootState, Transport } from "../../types";
import { midiAccess } from "../../media";
import { stopMIDI, startMIDI } from "./action_utils";
import { SET_TRANSPORT, NO_ACTION_REQUIRED } from "../../constants";
import { setProgress } from "./setProgress";
import { unschedule } from "../../../../webdaw/unschedule";

const clock = (() => {
  let id: number;

  const play = (start: number, callback: (p: number) => void) => {
    const now = performance.now();
    const progress = now - start;
    callback(progress);
    id = requestAnimationFrame(b => {
      play(now, callback);
    });
  };

  return {
    play,
    stop: () => {
      // console.log(id);
      cancelAnimationFrame(id);
    },
  };
})();

export const handleTransport = (transport: Transport) => async (
  dispatch: Dispatch
): Promise<void> => {
  const state = store.getState() as RootState;
  const { playheadMillis, songData } = state;

  if (transport === Transport.STOP || transport === Transport.PAUSE) {
    clock.stop();
    unschedule(songData.song, midiAccess?.outputs);
  } else if (transport === Transport.PLAY) {
    // startMIDI();
    clock.play(performance.now(), (progress: number) => {
      dispatch(setProgress(progress));
    });
  }
  // let track = currentTrack;
  // if (currentTrack !== null) {
  //   if (transport === Transport.STOP) {
  //     track = stopMIDI(currentTrack);
  //   } else if (transport === Transport.PLAY) {
  //     track = startMIDI(currentTrack, playheadMillis);
  //   }
  // }
  dispatch({
    // type: SET_TRANSPORT,
    type: NO_ACTION_REQUIRED,
    payload: {
      transport,
      // currentTrack: track,
    },
  });
};
