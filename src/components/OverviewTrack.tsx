import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";

// let i = 0;
type Props = { id: string };
const OverviewTrack = ({ id }: Props): JSX.Element => {
  const name = useSelector((state: RootState) => state.partsById[id].fileName);
  const type = useSelector((state: RootState) => state.partsById[id].type);
  const start = useSelector((state: RootState) => state.partsById[id].start);
  const duration = useSelector((state: RootState) => state.partsById[id].duration);
  const trimStart = useSelector((state: RootState) => state.partsById[id].trimStart);
  const trimEnd = useSelector((state: RootState) => state.partsById[id].trimEnd);
  const width = useSelector((state: RootState) => state.width);
  const durationTimeline = useSelector((state: RootState) => state.durationTimeline);
  // we have to calculate a different value for millisPerPixel because the overview
  // always uses the complete width of the page independent of the zoom level.
  const millisPerPixel = width / durationTimeline;

  return (
    <div
      id={id}
      key={id}
      className={`overview-track ${type}`}
      style={{
        left: `${start * millisPerPixel}px`,
        width: `${(duration - trimStart + trimEnd) * millisPerPixel}px`,
      }}
    >
      {/* {`${data.name} [${i++}]`} */}
    </div>
  );
};

export { OverviewTrack };
