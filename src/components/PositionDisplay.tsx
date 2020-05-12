import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
import { getNiceTime } from "../webdaw/utils";

const PositionDisplay = (): JSX.Element => {
  const playheadPosition = useSelector((state: RootState) => state.playheadPosition);
  const playheadPositionX = useSelector((state: RootState) => state.playheadPositionX);
  const width = useSelector((state: RootState) => state.width);
  // const display = getNiceTime(playheadPosition).timeAsString + ' X:' + Math.round(playheadPositionX) + ' W:' + Math.round(width);
  const display = getNiceTime(playheadPosition).timeAsString;

  return (
    <div className="position-display">
      {display}
    </div>
  );
};
export { PositionDisplay };
