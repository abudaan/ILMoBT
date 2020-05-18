import React, { useEffect, RefObject, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState, VAMTrack, RefVideo } from "../types";
import { MOVE_PLAYHEAD } from "../constants";

const VideoController = (): JSX.Element => {
  const video: HTMLVideoElement = useSelector(
    (state: RootState) => (state.referencesById.video as RefVideo).videoElement
  );
  const start: number = useSelector((state: RootState) => {
    if (typeof state.tracks[0] === "undefined") {
      return null;
    }
    return 0; // state.tracks[0].start;
  });
  const position = useSelector((state: RootState) => state.playheadMillis);
  const isPlaying = useSelector((state: RootState) => state.isPlaying);
  const action = useSelector((state: RootState) => state.editData.action);

  if (video !== null) {
    if (position >= start && isPlaying) {
      video.play();
    } else {
      if (action === MOVE_PLAYHEAD) {
        video.currentTime = position / 1000;
      }
      video.pause();
    }
  }

  return null;
};
export { VideoController };
