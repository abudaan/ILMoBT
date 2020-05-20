import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { startMovePlayhead } from "../redux/actions/startMovePlayhead";
import { RootState } from "../types";

export const Debug = (): JSX.Element => {
  const playheadPixels = useSelector((state: RootState) => state.playheadPixels);
  const transport = useSelector((state: RootState) => state.transport);
  const editAction = useSelector((state: RootState) => state.editAction);
  const notes = useSelector((state: RootState) => state.notes);
  const list = notes.map(n => {
    return <li>{`${n.id} ${n.ticks} ${n.duration}`}</li>;
  });

  return (
    <div className="debug">
      {/* <ul>
        <li>{transport}</li>
        <li>{editAction}</li>
      </ul> */}
      <ul>{list}</ul>
    </div>
  );
};
