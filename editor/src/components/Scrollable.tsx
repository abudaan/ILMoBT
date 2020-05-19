import React, { useEffect, useRef, RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { scrollArranger } from "../redux/actions/scrollArranger";
import { RootState } from "../types";

type Props = { children: JSX.Element[] };
const Scrollable = ({ children }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const containerRef: RefObject<HTMLDivElement> = useRef();
  const numNotes = useSelector((state: RootState) => state.numNotes);
  const noteHeight = useSelector((state: RootState) => state.noteHeight);

  // const onScroll = (e: SyntheticEvent): void => {
  //   const scroll = (e.nativeEvent.target as HTMLDivElement).scrollLeft;
  //   dispatch(scrollArranger(scroll));
  // };

  const onScroll = (event: Event): void => {
    const scroll = (event.target as HTMLDivElement).scrollLeft;
    dispatch(scrollArranger(scroll));
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", onScroll);
      return (): void => {
        containerRef.current.addEventListener("scroll", onScroll);
      };
    }
  });
  return (
    <div
      ref={containerRef}
      // onPointerUp={(e): void => {
      //   dispatch(handlePointerUp());
      // }}
      className="scrollable"
      style={{ height: `${numNotes * noteHeight + 100}px` }}
    >
      {children}
    </div>
  );
};

export { Scrollable };
