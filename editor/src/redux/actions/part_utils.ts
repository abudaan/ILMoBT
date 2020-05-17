import { RootState } from "../../types";
import { EDIT_RESIZE_LEFT, EDIT_RESIZE_RIGHT, EDIT_MOVE } from "../../constants";

export const editPart = (
  diffX: number,
  state: RootState
): {
  start: number;
  trimStart: number;
  trimEnd: number;
  durationTimeline: number;
} => {
  const {
    editData: { action, id },
    zoomLevel,
    millisPerPixel,
    durationTimeline,
  } = state;

  const part: VAMPartUI = state.partsById[id];
  const { start, trimStart, trimEnd, duration } = part;
  // console.log(trimStart, trimEnd, duration);

  // convert milliseconds to pixels
  const f = millisPerPixel * zoomLevel;
  const w = duration * f;
  const l = start * f;
  const pixels = {
    left: l,
    right: l + w,
    trimStart: trimStart * f,
    trimEnd: trimEnd * f,
    maxWidth: duration * f,
  };

  // const diffX = lastX !== null ? x - lastX : 0;
  const result = {
    left: pixels.left,
    right: pixels.right,
    trimStart: pixels.trimStart,
    trimEnd: pixels.trimEnd,
  };

  // console.log(action);
  if (action === EDIT_RESIZE_LEFT) {
    let l = pixels.left + diffX;
    let ts = pixels.trimStart + diffX;
    if (ts < 0) {
      ts = 0;
      l = pixels.left + ts;
    } else if (ts > pixels.maxWidth) {
      ts = pixels.maxWidth;
      l = pixels.left + ts;
    } else {
      l = l < 0 ? 0 : l;
    }
    result.left = l;
    result.trimStart = ts;
  } else if (action === EDIT_RESIZE_RIGHT) {
    let r = pixels.right + diffX;
    let te = pixels.trimEnd + diffX;
    if (te > 0) {
      te = 0;
      r = pixels.right + te;
    } else if (te < -pixels.maxWidth) {
      te = -pixels.maxWidth;
      r = pixels.right + te;
    }
    result.right = r;
    result.trimEnd = te;
  } else if (action === EDIT_MOVE) {
    let l = pixels.left + diffX;
    l = l < 0 ? 0 : l;
    result.left = l;
    if (l >= 0) {
      result.right = pixels.right + diffX;
    }
  }
  // console.log(x, lastX);
  // console.log(result.trimStart, result.trimEnd);
  // calculate start and duration in millis based on the new pixel values
  const trimStartMillis = result.trimStart / millisPerPixel / zoomLevel;
  const trimEndMillis = result.trimEnd / millisPerPixel / zoomLevel;
  return {
    start: result.left / millisPerPixel / zoomLevel,
    trimStart: trimStartMillis,
    trimEnd: trimEndMillis,
    durationTimeline: Math.max(
      durationTimeline,
      start + duration - trimStartMillis + trimEndMillis
    ),
  };
};

export const getEditAction = (x: number, id: string, state: RootState): string => {
  const { thumbSize, zoomLevel, millisPerPixel } = state;
  const part = state.partsById[id];
  const f = millisPerPixel * zoomLevel;
  const minX = part.trimStart * f + thumbSize;
  const maxX = (part.duration - part.trimStart + part.trimEnd) * f - thumbSize;
  let action = "";

  if (x < minX) {
    action = EDIT_RESIZE_LEFT;
  } else if (x > maxX) {
    action = EDIT_RESIZE_RIGHT;
  } else {
    action = EDIT_MOVE;
  }
  // console.log(id, x, minX, maxX, action);
  return action;
};

export const getInfo = ({
  id,
  zoomLevel,
  millisPerPixel,
  part,
}: {
  id: string;
  zoomLevel: number;
  millisPerPixel: number;
  part: VAMPartUI;
}): string[][] => {
  // console.log(id);
  if (!id) {
    return [];
  }

  const { duration, fileName, start, trimStart, trimEnd } = part;
  const f = millisPerPixel * zoomLevel;
  const startPx = start * f;
  const trimStartPx = trimStart * f;
  const trimEndPx = trimEnd * f;
  const durationPx = duration * f;
  return [
    ["name", fileName],
    ["start", ` ${start} millis`],
    ["trim start", ` ${trimStart} millis`],
    ["trim end", ` ${trimEnd} millis`],
    ["duration", `${duration - trimStart + trimEnd} millis`],
    ["trimmed", `${duration} millis`],
    ["start", ` ${startPx}px`],
    ["trim start", ` ${trimStartPx}px`],
    ["trim end", ` ${trimEndPx}px`],
    ["duration", `${durationPx}px`],
    ["trimmed", `${durationPx - trimStartPx + trimEndPx}px`],
    ["millisPerPixel", `${millisPerPixel}`],
    ["zoomLevel", `${zoomLevel}`],
  ];
};
