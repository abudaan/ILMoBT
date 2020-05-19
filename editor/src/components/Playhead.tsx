import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { startMovePlayhead } from "../redux/actions/startMovePlayhead";
import { RootState } from "../types";

const Playhead = (): JSX.Element => {
  const dispatch = useDispatch();
  const playheadPixels = useSelector((state: RootState) => state.playheadPixels);
  const left = `${playheadPixels}px`;

  return (
    <div
      id="playhead"
      className="playhead"
      onPointerDown={e => {
        dispatch(startMovePlayhead(e));
      }}
      style={{ left }}
    >
      {/* <div>{playheadPositionX}</div> */}
      <div></div>
    </div>
  );
};
export { Playhead };
