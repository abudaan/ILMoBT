import React from "react";
import uniquid from "uniquid";
import { useSelector, useDispatch } from "react-redux";
// import { handlePointerDown } from "../redux/actions/handlePointer";
import { RootState } from "../types";

export const List = (): JSX.Element => {
  const dispatch = useDispatch();
  const files = useSelector((state: RootState) => state.ListData);
  const divFiles = files.map(d => {
    return <div key={uniquid()} onPointerDown={(e) => {console.log(e);}}>{d.title}</div>
  });

  return (
    <div className="list">
     {divFiles}
    </div>
  );
};
