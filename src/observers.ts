import { store, getState$ } from "./redux/store";
import { distinctUntilKeyChanged, map } from "rxjs/operators";
import { setProgress } from "./redux/actions/handleOther";
import { Transport } from "./types";

export const setupClock = () => {
  let id: number;
  let start = 0;
  let progress = 0;

  const state$ = getState$();
  state$
    .pipe(
      distinctUntilKeyChanged("transport"),
      map(app => ({
        transport: app.transport,
        position: app.playheadPosition,
        tracks: app.tracks,
        currentTrackIndex: app.currentTrackIndex,
      }))
    )
    .subscribe(({ transport, position, tracks, currentTrackIndex }) => {
      const track = tracks[currentTrackIndex];
      if (!track) {
        return;
      }
      const duration = tracks[currentTrackIndex].duration;
      const end = position >= duration;
      const isPlaying = transport === Transport.PLAY && !end;
      if (isPlaying) {
        start = performance.now();
        play(start);
      } else {
        cancelAnimationFrame(id);
      }
    });

  const play = (a: number) => {
    progress = a - start;
    store.dispatch(setProgress(progress));
    start = a;
    id = requestAnimationFrame(b => {
      play(performance.now());
    });
    // console.log(progress);
  };
};

