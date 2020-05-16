import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../types";
import { getNiceTime } from "../webdaw/utils";
import { handlePointerDown } from "../redux/actions/handlePointer";

const minWidthTick = 50;
const minWidthLabel = 100;

const TimeTicks = (): JSX.Element => {
  const dispatch = useDispatch();
  const durationTimeline = useSelector((state: RootState) => state.durationTimeline);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const millisPerPixel = useSelector((state: RootState) => state.millisPerPixel);
  const ticks = [];
  let millis = 0;
  let anchor = 0;
  let i = 0;
  while (millis < durationTimeline) {
    let label = <span></span>;
    // const pixels = 100 * i++; //millis * millisPerPixel * zoomLevel;
    const pixels = millis * millisPerPixel * zoomLevel;
    const style = {
      left: `${pixels}px`,
      width: `${1000 * millisPerPixel * zoomLevel}px`,
    };
    const diff = pixels - anchor;
    if (diff >= minWidthTick || pixels === 0) {
      anchor = pixels;
      const { minute, second } = getNiceTime(millis);
      const secondString = second < 10 ? `0${second}` : `${second}`;
      const time = `${minute}:${secondString}`;
      label = (
        <div key={time} className="label">
          {time}
        </div>
      );
    }
    ticks.push(
      <div key={`tick-${millis}`} className="tick" style={style}>
        {label}
        <div key={`line-${millis}`} className="second"></div>
      </div>
    );
    millis += 1000;
  }
  return (
    // <div className="time-ticks" style={{ width: `${duration * minWidthLabel}px` }}>
    <div
      id="time-ticks"
      className="time-ticks"
      onPointerDown={e => {
        dispatch(handlePointerDown(e));
        // console.log(e.currentTarget.id);
      }}
    >
      {ticks}
    </div>
  );
};
export { TimeTicks };
