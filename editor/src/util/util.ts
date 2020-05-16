import { SyntheticEvent } from "react";

export const getNativeEvent = (e: SyntheticEvent): MouseEvent | TouchEvent => {
  if ((e.nativeEvent as TouchEvent).touches) {
    return e.nativeEvent as TouchEvent;
  }
  return e.nativeEvent as MouseEvent;
};

export const getClientPos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if ((e as TouchEvent).touches) {
    return {
      x: (e as TouchEvent).touches[0].clientX,
      y: (e as TouchEvent).touches[0].clientY,
    };
  }
  return {
    x: (e as MouseEvent).clientX,
    y: (e as MouseEvent).clientY,
  };
};

export const getScreenPos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if ((e as TouchEvent).touches) {
    return {
      x: (e as TouchEvent).touches[0].screenX,
      y: (e as TouchEvent).touches[0].screenY,
    };
  }
  return {
    x: (e as MouseEvent).screenX,
    y: (e as MouseEvent).screenY,
  };
};

export const getPagePos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if ((e as TouchEvent).touches) {
    return {
      x: (e as TouchEvent).touches[0].pageX,
      y: (e as TouchEvent).touches[0].pageY,
    };
  }
  return {
    x: (e as MouseEvent).pageX,
    y: (e as MouseEvent).pageY,
  };
};

export const getOffset = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if ((e as TouchEvent).touches) {
    const box = (e.target as HTMLElement).getBoundingClientRect();
    return {
      x: (e as TouchEvent).touches[0].pageX - box.left,
      y: (e as TouchEvent).touches[0].pageY - box.top,
    };
  }
  return {
    x: (e as MouseEvent).offsetX,
    y: (e as MouseEvent).offsetY,
  };
};

/*
export const getOffset2 = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  if ((e as TouchEvent).touches) {
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return {
      x: (e as TouchEvent).touches[0].pageX - box.left,
      y: (e as TouchEvent).touches[0].pageY - box.top,
    };
  }
  // console.log(e.target, e.currentTarget);
  const box = (e.target as HTMLElement).parentElement.getBoundingClientRect();
  console.log(box, (e as MouseEvent).clientX);
  return {
    x: (e as MouseEvent).offsetX,
    y: (e as MouseEvent).offsetY,
  };
};
*/
