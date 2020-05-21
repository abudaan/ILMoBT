import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { setProgress } from "../redux/actions/setProgress";

// let id: number;

const Clock = (): JSX.Element => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state: RootState) => state.isPlaying);

  let id: number;
  let start: number = 0;
  let progress: number = 0;

  const play = (a: number) => {
    const ts = performance.now();
    progress = ts - start;
    // console.log(progress);
    dispatch(setProgress(progress));
    start = ts;
    if (isPlaying) {
      id = requestAnimationFrame(a => {
        play(a);
      });
    } else {
      cancelAnimationFrame(id);
    }
    // console.log(id, progress);
  };

  // console.log("RENDER");
  if (isPlaying) {
    start = performance.now();
    play(performance.now());
  } else {
    cancelAnimationFrame(id);
  }

  // return <div>{`${isPlaying} ${progress} ${start}`}</div>;
  return null;
};
export { Clock };
