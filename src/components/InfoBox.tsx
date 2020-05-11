import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, VAMPart } from "../types";
import { createSelector } from "reselect";
import { store } from "../redux/store";
import { getNiceTime } from "../webdaw/utils";

const editIdSelector = (state: RootState): string => state.editData.id;
const partsSelector = (state: RootState): { [id: string]: VAMPart } => state.partsById;
const uiDataSelector = (
  state: RootState
): {
  millisPerPixel: number;
  zoomLevel: number;
  playheadPosition: number;
  playheadPositionX: number;
  arrangerScrollPos: number;
} => {
  return {
    millisPerPixel: state.millisPerPixel,
    zoomLevel: state.zoomLevel,
    playheadPosition: state.playheadPosition,
    playheadPositionX: state.playheadPositionX,
    arrangerScrollPos: state.arrangerScrollPos,
  };
};

const getInfo = createSelector(
  editIdSelector,
  partsSelector,
  uiDataSelector,
  (id, partsById, ui): JSX.Element => {
    // console.log(id);
    if (id === null) {
      return <div>no info</div>;
    }
    if (id === "playhead" || id === "time-ticks") {
      return (
        <table>
          <thead>
            <tr>
              <th>position</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>millis</td>
              <td>{getNiceTime(ui.playheadPosition).timeAsString}</td>
            </tr>
            <tr>
              <td>pixels</td>
              <td>{ui.playheadPositionX}</td>
            </tr>
            <tr>
              <td>scroll</td>
              <td>{ui.arrangerScrollPos}</td>
            </tr>
            <tr>
              <td>repaint</td>
              <td>{i++}</td>
            </tr>
          </tbody>
        </table>
      );
    }
    const part = partsById[id];
    const f = ui.millisPerPixel * ui.zoomLevel;
    const start = Math.round(part.start);
    const startPx = Math.round(part.start * f);

    const trimStart = Math.round(part.trimStart);
    const trimStartPx = Math.round(part.trimStart * f);

    const trimEnd = Math.round(part.trimEnd);
    const trimEndPx = Math.round(part.trimEnd * f);

    const duration = Math.round(part.duration) - trimStart + trimEnd;
    const durationPx = Math.round(part.duration * f) - trimStartPx + trimEndPx;

    const durationMax = Math.round(part.duration);
    const durationMaxPx = Math.round(part.duration * f);

    let key = 0;
    return (
      <table>
        <thead>
          <tr>
            <th>general</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>name</td>
            <td>{part.fileName}</td>
          </tr>
          <tr>
            <td>duration</td>
            <td>{getNiceTime(durationMax).timeAsString}</td>
          </tr>
          <tr>
            <td>millisPerPixel</td>
            <td>{ui.millisPerPixel}</td>
          </tr>
          {/* <tr>
            <td>zoomLevel</td>
            <td>{ui.zoomLevel}</td>
          </tr> */}
          <tr>
            <td>scroll</td>
            <td>{ui.arrangerScrollPos}</td>
          </tr>
          <tr>
            <td>repaint</td>
            <td>{i++}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>current</td>
            <td>{getNiceTime(part.currentTime).timeAsString}</td>
          </tr>
          <tr>
            <td>start</td>
            <td>{getNiceTime(start).timeAsString}</td>
          </tr>
          <tr>
            <td>trimStart</td>
            <td>{getNiceTime(trimStart).timeAsString}</td>
          </tr>
          <tr>
            <td>trimEnd</td>
            <td>{getNiceTime(trimEnd).timeAsString}</td>
          </tr>
          <tr>
            <td>duration</td>
            <td>{getNiceTime(duration).timeAsString}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>pixels</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>start</td>
            <td>{startPx}</td>
          </tr>
          <tr>
            <td>trimStart</td>
            <td>{trimStartPx}</td>
          </tr>
          <tr>
            <td>trimEnd</td>
            <td>{trimEndPx}</td>
          </tr>
          <tr>
            <td>duration</td>
            <td>{durationPx}</td>
          </tr>
        </tbody>
      </table>
    );

    // return [
    //   [
    //     ["name", track.file.name],
    //     ["millisPerPixel", `${ui.millisPerPixel}`],
    //     ["zoomLevel", `${ui.zoomLevel}`],
    //   ],
    //   ["millis"],
    //   ["start", ` ${Math.round(track.start)}millis`],
    //   ["trim start", ` ${Math.round(track.trimStart)}millis`],
    //   ["trim end", ` ${Math.round(track.trimEnd)}millis`],
    //   ["duration", `${Math.round(track.file.duration - track.trimStart + track.trimEnd)}millis`],
    //   ["trimmed", `${Math.round(track.file.duration)}millis`],
    //   ["start", ` ${Math.round(startPx)}px`],
    //   ["trim start", ` ${Math.round(trimStartPx)}px`],
    //   ["trim end", ` ${Math.round(trimEndPx)}px`],
    //   ["duration", `${Math.round(durationPx)}px`],
    //   ["trimmed", `${Math.round(durationPx - trimStartPx + trimEndPx)}px`],
    // ];
  }
);

let i = 0;
const InfoBox = (): JSX.Element => {
  // define sometriggers
  useSelector((state: RootState) => state.editData.id);
  useSelector((state: RootState) => state.editData.lastX);
  useSelector((state: RootState) => state.playheadPositionX);
  useSelector((state: RootState) => state.arrangerScrollPos);
  const table = getInfo(store.getState());
  return <div className="info-box">{table}</div>;
};
export { InfoBox };
