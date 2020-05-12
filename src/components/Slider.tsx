import React, { useEffect, useRef, RefObject } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
/* React wrapper for input type Range */
type Props = {
  max: number;
  min: number;
  value: number;
  id?: string;
  label?: string;
  step?: number;
  type?: string;
  disabled: boolean;
};

const Slider = (props: Props): JSX.Element => {
  const refSlider: RefObject<HTMLInputElement> = React.createRef();
  const value = useSelector((state: RootState) => state.playheadPercentage);
  const width = useSelector((state: RootState) => state.width);
  const {
    max,
    min,
    id = `slider-${Date.now()}`,
    step = 1,
    type,
    disabled,
  } = props;

  let sliderWidth: number = 100;
  useEffect(() => {
    if (refSlider.current) {
      sliderWidth = refSlider.current.getBoundingClientRect().width;
      console.log(sliderWidth);
    }
  }, [width])

  return (
    <div className="react-slider" id={id}>
      <input
        ref={refSlider}
        key={type}
        type="range"
        disabled={disabled}
        value={`${value}`}
        min={min}
        max={max}
        step={step}
        onChange={() => { }}
        onPointerDown={(e) => {
          const x = (e.nativeEvent as MouseEvent).offsetX;
          // console.log(x / sliderWidth);
        }}
      // onPointerUp={onInput}
      />
    </div>
  );
};

// export default React.memo(Slider);
export { Slider };
