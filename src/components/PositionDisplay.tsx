import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { getNiceTime } from "../webdaw/utils";

const PositionDisplay = (): JSX.Element => {
  const dispatch = useDispatch();
  const playheadPosition = useSelector((state: RootState) => state.playheadPosition);
  const display = getNiceTime(playheadPosition).timeAsString;

  return (
    <div className="position-display">
      {display}
    </div>
  );
};
export { PositionDisplay };
