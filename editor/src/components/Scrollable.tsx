import React, { useEffect, useRef, RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { scrollEditor } from "../redux/actions/scrollEditor";
import { RootState } from "../types";

type Props = { children: JSX.Element[] };
const Scrollable = ({ children }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const containerRef: RefObject<HTMLDivElement> = useRef();
  const numNotes = useSelector((state: RootState) => state.songData.numNotes);
  const noteHeight = useSelector((state: RootState) => state.noteHeight);
  const scrollLeft = useSelector((state: RootState) => state.editorScrollPos);
  // console.log(scrollLeft);

  // const onScroll = (e: SyntheticEvent): void => {
  //   const scroll = (e.nativeEvent.target as HTMLDivElement).scrollLeft;
  //   dispatch(scrollArranger(scroll));
  // };

  const onScroll = (event: Event): void => {
    const scroll = (event.target as HTMLDivElement).scrollLeft;
    dispatch(scrollEditor(scroll));
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", onScroll);
      containerRef.current.scrollLeft = scrollLeft;
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
      style={{ height: `${numNotes * noteHeight + 40}px` }}
    >
      {children}
    </div>
  );
};

export { Scrollable };
