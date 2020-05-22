import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { setPosition } from "../redux/actions/setPosition";
import { startSeek } from "../redux/actions/startSeek";

const Slider = (): JSX.Element => {
  const dispatch = useDispatch();
  const playheadPositionX = useSelector((state: RootState) => state.playheadPixels);

  const thumbStyle = {
    left: `${playheadPositionX}px`,
  };

  return (
    <div
      id="slider"
      className="slider"
      onPointerDown={e => {
        dispatch(setPosition(e));
      }}
    >
      <div
        id="thumb"
        className="thumb"
        onPointerDown={e => {
          dispatch(startSeek(e));
        }}
        style={thumbStyle}
      ></div>
    </div>
  );
};

export { Slider };
