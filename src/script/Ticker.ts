import { Component } from '../component';

export const updateFps = () => {
  if (!Component.canvas) {
    return;
  }

  Component.profiler?.list['fps'][1](
    Component.canvas.ticker.FPS.toFixed(0)
  );
};
