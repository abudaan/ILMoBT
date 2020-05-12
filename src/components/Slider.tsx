import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";

const Slider = (): JSX.Element => {
  const playheadPercentage = useSelector((state: RootState) => state.playheadPercentage);
  const width = useSelector((state: RootState) => state.width);
  
  const thumbStyle = {
    left: `${playheadPercentage * width}px`
  }

  return (
    <div className="slider">
      <div className="thumb" style={thumbStyle}></div>
    </div>
  );
};

export { Slider };
