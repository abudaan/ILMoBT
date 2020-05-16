import React, { useRef, RefObject, useEffect, SyntheticEvent, useState } from "react";
import { getNativeEvent, getClientPos, getOffset } from "../util/util";

// NOT IN USE => KEEP FOR REFERENCE

let i = 0;

type LocalState = {
  startEdit?: boolean;
  startX?: number;
  style?: {
    left: string;
    width?: string;
    right?: string;
  };
};

let localState = {
  startEdit: false,
  startX: null,
  style: { left: "0px" },
};

// use local state to save render calls
const updateLocalState = (s: LocalState): LocalState => {
  localState = {
    ...localState,
    ...s,
  };
  // console.log(localState);
  return localState;
};

const ResizableLocal = (): JSX.Element => {
  const refDiv: RefObject<HTMLDivElement> = useRef();

  const onStartEdit = (e: SyntheticEvent): void => {
    const n = getNativeEvent(e);
    const { x, y } = getOffset(n);
    updateLocalState({ startX: x, startEdit: true });
  };

  const onStopEdit = (e: MouseEvent | TouchEvent): void => {
    updateLocalState({ startX: null, startEdit: false });
  };

  const onEdit = (e: SyntheticEvent): void => {
    if (localState.startEdit === false) {
      return;
    }
    const n = getNativeEvent(e);
    const { x, y } = getClientPos(n);
    updateLocalState({ style: { left: `${x - localState.startX}px` } });
    const div = e.target as HTMLDivElement;
    div.style.left = localState.style.left;
  };

  useEffect(() => {
    document.addEventListener("mouseup", onStopEdit);
    document.addEventListener("touchend", onStopEdit);
    return (): void => {
      document.removeEventListener("mouseup", onStopEdit);
      document.removeEventListener("touchend", onStopEdit);
    };
  });

  return (
    <div
      ref={refDiv}
      onPointerDown={onStartEdit}
      onPointerMove={onEdit}
      className="resizable"
      style={localState.style}
    >
      {`${localState.style.left} ${i++}`}
    </div>
  );
};

export { ResizableLocal };
