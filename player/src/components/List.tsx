import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTrack } from "../redux/actions/selectTrack";
import { RootState } from "../types";

export const List = (): JSX.Element => {
  const dispatch = useDispatch();
  const tracks = useSelector((state: RootState) => state.tracks);
  const currentTrackIndex = useSelector((state: RootState) => state.currentTrackIndex);
  const divTracks = tracks.map((d, i) => {
    const className = i === currentTrackIndex ? "list-item active" : "list-item";
    return (
      <div
        key={`track-%${i}`}
        className={className}
        onPointerDown={() => {
          dispatch(selectTrack(i));
        }}
      >
        {d.title}
      </div>
    );
  });

  return <div className="list">{divTracks}</div>;
};

/* <i className="fas fa-play fa-xs"></i> */
