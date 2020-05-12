import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { setPosition, startSeek } from "../redux/actions/handleOther";

const Slider = (): JSX.Element => {
  const dispatch = useDispatch();
  const playheadPercentage = useSelector((state: RootState) => state.playheadPercentage);
  const width = useSelector((state: RootState) => state.width);

  const thumbStyle = {
    left: `${playheadPercentage * width}px`
  }

  return (
    <div id="slider" className="slider" onPointerDownCapture={(e) => { dispatch(setPosition(e)); }}>
      <div id="thumb" className="thumb" onPointerDown={(e) => { dispatch(startSeek(e)); }} style={thumbStyle}></div>
    </div>
  );
};

export { Slider };
