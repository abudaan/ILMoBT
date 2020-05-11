import { store, getState$ } from "./redux/store";
import { distinctUntilKeyChanged, map, pluck, pairwise } from "rxjs/operators";
import { setProgress } from "./redux/actions/handleOther";
import { Transport, VAMPart } from "./types";

const setupClock = () => {
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
        durationTimeline: app.durationTimeline,
      }))
    )
    .subscribe(({ transport, position, durationTimeline }) => {
      const end = position >= durationTimeline;
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

// not in use
const setupChecker = () => {
  let updatePosition = false;
  const state$ = getState$();

  state$
    .pipe(
      distinctUntilKeyChanged("playheadPosition"),
      map(app => ({
        position: app.playheadPosition,
        partsById: app.partsById,
        transport: app.transport,
      }))
    )
    .subscribe(({ position, partsById, transport }) => {
      Object.values(partsById).forEach(part => {
        const max = part.start + part.duration - part.trimStart + part.trimEnd;
        if (position >= part.start && position < max) {
          if (transport === Transport.PLAY) {
            if (part.transport !== Transport.PLAY) {
              part.currentTime = position - part.start + part.trimStart;
              part.transport = Transport.PLAY;
            } else if (updatePosition === true) {
              updatePosition = false;
              part.currentTime = position - part.start + part.trimStart;
            }
          } else {
            // console.log(position, trackUI.start, trackUI.trimStart);
            part.currentTime = position - part.start + part.trimStart;
          }
          // process(part);
        } else {
          if (part.transport === Transport.PLAY) {
            part.transport = Transport.PAUSE;
            // process(part);
          }
        }
      });
    });

  state$
    .pipe(
      pluck("editData"),
      distinctUntilKeyChanged("id"),
      pluck("id"),
      pairwise(),
      map(d => d)
    )
    .subscribe(([prev, curr]) => {
      // pointer down
      if (prev === null && curr === "time-ticks") {
        updatePosition = true;
      }
    });

  // state$
  //   .pipe(
  //     distinctUntilKeyChanged("transport"),
  //     map(app => ({ transport: app.transport, partsById: app.partsById }))
  //   )
  //   .subscribe(({ partsById, transport }) => {
  //     Object.values(partsById).forEach(part => {
  //       part.transport = transport;
  //     });
  //   });
};

export { setupClock, setupChecker };
