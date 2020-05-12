import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../types";
/* React wrapper for input type Range */
type Props = {
  max: number;
  min: number;
  value: number;
  id?: string;
  label?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // move slider thumb
  onInput: (event: React.FormEvent<HTMLInputElement>) => void; // release slider thumb
  step?: number;
  type?: string;
  disabled: boolean;
};

const Slider = (props: Props): JSX.Element => {
  const value = useSelector((state: RootState) => state.playheadPercentage);
  const {
    max,
    min,
    id = `slider-${Date.now()}`,
    onChange,
    onInput,
    step = 1,
    type,
    disabled,
  } = props;

  return (
    <div className="react-slider" id={id}>
      <input
        key={type}
        type="range"
        disabled={disabled}
        value={`${value}`}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onTouchEndCapture={onInput}
        onMouseUpCapture={onInput}
      />
    </div>
  );
};

// export default React.memo(Slider);
export { Slider };
