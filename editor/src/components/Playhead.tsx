import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { handlePointerDown } from "../redux/actions/handlePointer";
import { RootState } from "../types";

const Playhead = (): JSX.Element => {
  const dispatch = useDispatch();
  const playheadPositionX = useSelector((state: RootState) => state.playheadPixels);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const millisPerPixel = useSelector((state: RootState) => state.millisPerPixel);
  // const left = `${playheadPositionX * millisPerPixel * zoomLevel}px`;
  const left = `${playheadPositionX}px`;

  return (
    <div
      id="playhead"
      className="playhead"
      onPointerDown={e => {
        dispatch(handlePointerDown(e));
      }}
      style={{ left }}
    >
      {/* <div>{playheadPositionX}</div> */}
      <div></div>
    </div>
  );
};
export { Playhead };
