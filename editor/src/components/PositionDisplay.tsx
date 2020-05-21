import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
import { getNiceTime } from "../../../webdaw/utils";

const PositionDisplay = (): JSX.Element => {
  const playheadMillis = useSelector((state: RootState) => state.playheadMillis);
  const playheadPixels = useSelector((state: RootState) => state.playheadPixels);
  const songData = useSelector((state: RootState) => state.songData);
  const width = useSelector((state: RootState) => state.width);
  // const display = getNiceTime(playheadPosition).timeAsString + ' X:' + Math.round(playheadPositionX) + ' W:' + Math.round(width);
  // const display = getNiceTime(playheadPosition).timeAsString;
  const a = getNiceTime(playheadMillis).timeAsArrayString;
  // const b = getNiceTime(songData.song.durationMillis).timeAsArrayString;
  // const display = `${a[1]}:${a[2]} / ${b[1]}:${b[2]}`;
  const display = `${a[1]}:${a[2]}:${a[3]}`;

  return (
    <div className="position-display">
      <div>{display}</div>
    </div>
  );
};
export { PositionDisplay };
