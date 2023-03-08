import { app } from '../component';

export const updateFps = () => {
  if (!app.canvas) {
    return;
  }

  app.profiler?.list['fps'][1](
    app.canvas.ticker.FPS.toFixed(0)
  );
};
