"use client";

// Options to determine if we are on a touch-capable device:
// let isTouch1 = window.matchMedia("(pointer: coarse)").matches;
// let isTouch2 = navigator.maxTouchPoints > 0;
// let isTouch3 = 'ontouchstart' in window;
// from: https://stackoverflow.com/questions/73093713/detect-if-the-browser-has-swipe-navigation-gestures-enabled-with-javascript

export const isTouchEnabled = () => {
  return window.matchMedia("(pointer: coarse)").matches;
};
