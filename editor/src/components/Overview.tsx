import React, { useEffect } from "react";
import { OverviewTrack } from "./OverviewTrack";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { handlePointerMove } from "../redux/actions/handlePointer";
import { RootState } from "../types";

const Overview = (): JSX.Element => {
  const dispatch = useDispatch();
  const partIds = useSelector((state: RootState) => Object.keys(state.partsById), shallowEqual);

  return (
    <div
      onPointerMove={(e): void => {
        dispatch(handlePointerMove(e));
      }}
      className="overview"
    >
      {partIds.map(id => (
        <OverviewTrack id={id} key={id} />
      ))}
    </div>
  );
};
export { Overview };
