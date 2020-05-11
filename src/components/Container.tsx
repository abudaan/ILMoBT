import React from "react";
import { Resizable } from "./TrackUI";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { handlePointerMove } from "../redux/actions/handlePointer";
import { RootState } from "../types";
import { Playhead } from "./Playhead";

type Props = { children: JSX.Element };
const Container = ({ children }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const thumbSize = useSelector((state: RootState) => state.thumbSize);
  const partIds = useSelector((state: RootState) => Object.keys(state.partsById), shallowEqual);
  const durationTimeline = useSelector((state: RootState) => state.durationTimeline);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const millisPerPixel = useSelector((state: RootState) => state.millisPerPixel);
  const width = `${durationTimeline * millisPerPixel * zoomLevel}px`;

  return (
    <div
      style={{ width }}
      onPointerMove={(e): void => {
        dispatch(handlePointerMove(e));
      }}
      className="container"
    >
      {children}
      {partIds.map(id => (
        <Resizable id={id} key={id} thumbSize={thumbSize} />
      ))}
      <Playhead></Playhead>
    </div>
  );
};
export { Container };
