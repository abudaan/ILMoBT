import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
import { getNiceTime } from "../../../webdaw/utils";

const PositionDisplay = (): JSX.Element => {
  const playheadPosition = useSelector((state: RootState) => state.playheadMillis);
  const currentTrack = useSelector((state: RootState) => state.currentTrack);
  const playheadPositionX = useSelector((state: RootState) => state.playheadPixels);
  const width = useSelector((state: RootState) => state.width);
  // const display = getNiceTime(playheadPosition).timeAsString + ' X:' + Math.round(playheadPositionX) + ' W:' + Math.round(width);
  // const display = getNiceTime(playheadPosition).timeAsString;
  const a = getNiceTime(playheadPosition).timeAsArrayString
  const b = getNiceTime(currentTrack.duration).timeAsArrayString
  const display = `${a[1]}:${a[2]} / ${b[1]}:${b[2]}`;

  return (
    <div className="position-display">
      {display}
    </div>
  );
};
export { PositionDisplay };
