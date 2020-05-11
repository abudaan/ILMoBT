import React, { useEffect } from "react";
import { Resizable } from "../components/TrackUI";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { handlePointerMove } from "../redux/actions/handlePointer";
import { RootState } from "../types";

const ZoomThumb = (): JSX.Element => {
  const dispatch = useDispatch();
  const thumbSize = useSelector((state: RootState) => state.thumbSize);
  const partIds = useSelector((state: RootState) => Object.keys(state.partsById), shallowEqual);

  return (
    <div
      onPointerMove={(e): void => {
        dispatch(handlePointerMove(e));
      }}
      className="zoom-thumb"
    >
      {partIds.map(id => (
        <Resizable id={id} key={id} thumbSize={thumbSize} />
      ))}
    </div>
  );
};
export { ZoomThumb };
