import React from "react";
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

const createLabel = (label: string, value: number) => {
  let l = `${value}`;
  if (label !== "") {
    l = label + ": <em>" + value + "</em>";
  }
  return { __html: l };
};

const Slider = (props: Props): JSX.Element => {
  const {
    max,
    min,
    value,
    id = `slider-${Date.now()}`,
    label = "",
    onChange,
    onInput,
    step = 1,
    type,
    disabled,
  } = props;

  return (
    <div className="react-slider" id={id}>
      {/* <label htmlFor={id} dangerouslySetInnerHTML={createLabel(label, value)} /> */}
      <input
        key={type}
        type="range"
        disabled={disabled}
        defaultValue={`${value}`}
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
