import React, { useRef, RefObject, useEffect, SyntheticEvent, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { handlePointerUp, handlePointerDown } from "../redux/actions/handlePointer";
import { RootState, EditData } from "../types";
import { getNativeEvent, getPagePos, getClientPos } from "../util/util";

// let i = 0;
type Props = { id: string; thumbSize: number };
const Resizable = ({ id, thumbSize }: Props): JSX.Element => {
  // const refDiv: RefObject<HTMLDivElement> = useRef();
  const arrangerScrollPos = useSelector((state: RootState) => state.arrangerScrollPos);
  const zoomLevel = useSelector((state: RootState) => state.zoomLevel);
  const millisPerPixel = useSelector((state: RootState) => state.millisPerPixel);
  const type = useSelector((state: RootState) => state.partsById[id].type);
  const start = useSelector((state: RootState) => state.partsById[id].start);
  const trimStart = useSelector((state: RootState) => state.partsById[id].trimStart);
  const trimEnd = useSelector((state: RootState) => state.partsById[id].trimEnd);
  const duration = useSelector((state: RootState) => state.partsById[id].duration);

  // console.log(start, type, duration, millisPerPixel, zoomLevel);
  // console.log(trimStart, trimEnd);
  const f = zoomLevel * millisPerPixel;
  const left = start * f;
  const width = duration * f - trimStart * f + trimEnd * f;

  const [cursor, setCursor] = useState("default");
  const dispatch = useDispatch();

  const onPointerUp = (): void => {
    dispatch(handlePointerUp());
  };

  const onPointerDown = (e: SyntheticEvent): void => {
    dispatch(handlePointerDown(e));
  };

  const onPointerMove = (e: SyntheticEvent): void => {
    const n = getNativeEvent(e);
    let { x } = getPagePos(n);
    x += arrangerScrollPos;
    // console.log(x, left);
    let c = "default";
    if (x < left + thumbSize) {
      c = "w-resize";
    } else if (x > left + width - thumbSize) {
      c = "w-resize";
    } else {
      c = "move";
    }
    if (c !== cursor) {
      setCursor(c);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("mouseleave", onPointerUp);
    document.addEventListener("touchend", onPointerUp);
    document.addEventListener("touchcancel", onPointerUp);

    return (): void => {
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("mouseleave", onPointerUp);
      document.removeEventListener("touchend", onPointerUp);
      document.removeEventListener("touchcancel", onPointerUp);
    };
  });

  return (
    <div
      id={id}
      key={id}
      // ref={refDiv}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className={`resizable ${type}`}
      style={{
        cursor,
        left: `${left}px`,
        width: `${width}px`,
      }}
    >
      {/* {`${duration} [${i++}]`} */}
      {/* {`[${i++}]`} */}
    </div>
  );
};

export { Resizable };
