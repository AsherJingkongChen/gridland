import { app, profiles } from '../component';
import { db } from '../database';
import { windowNotPreventDefault } from '../tool';

export const updateFps = () => {
  profiles.set.fps(app.ticker.FPS.toFixed(0));
};

export const closeApp = () => {
  app.destroy(true, true);
  db.close();

  windowNotPreventDefault('keydown');
  windowNotPreventDefault('wheel');
};
