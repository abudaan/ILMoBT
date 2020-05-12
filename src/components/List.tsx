import React from "react";
import uniquid from "uniquid";
import { useSelector, useDispatch } from "react-redux";
import { selectTrack } from "../redux/actions/handleOther";
import { RootState } from "../types";

export const List = (): JSX.Element => {
  const dispatch = useDispatch();
  const tracks = useSelector((state: RootState) => state.tracks);
  const divTracks = tracks.map((d, i) => {
    return <div
      key={uniquid()}
      className="list-item"
      onPointerDown={() => {
        dispatch(selectTrack(i));
      }}>{d.title}
    </div>
  });

  return (
    <div className="list">
      {divTracks}
    </div>
  );
};

/* <i className="fas fa-play fa-xs"></i> */