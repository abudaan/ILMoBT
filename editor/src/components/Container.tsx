import React from "react";
import { Resizable } from "./TrackUI";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { handlePointerMove } from "../redux/actions/handlePointer";
import { RootState } from "../types";
import { Playhead } from "./Playhead";

type Props = { children: JSX.Element };
const Container = ({ children }: Props): JSX.Element => {
  const dispatch = useDispatch();
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
      <Playhead></Playhead>
    </div>
  );
};
export { Container };
