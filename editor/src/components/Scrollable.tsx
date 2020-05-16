import React, { useEffect, useRef, RefObject, SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { scrollArranger } from "../redux/actions/handleOther";
import { handlePointerUp } from "../redux/actions/handlePointer";

type Props = { children: JSX.Element };
const Scrollable = ({ children }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const containerRef: RefObject<HTMLDivElement> = useRef();

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
      onPointerUp={(e): void => {
        dispatch(handlePointerUp());
      }}
      className="scrollable"
    >
      {children}
    </div>
  );
};

export { Scrollable };
