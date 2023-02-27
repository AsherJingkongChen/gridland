import {
  Application,
  BitmapText,
} from "pixi.js";
import {
  Db,
  World,
} from '../database';
import {
  uiFontName,
} from "../resource";
import {
  Camera,
} from "./Camera";
import {
  Profiler,
} from './Profiler';
import {
  Zone,
} from './Zone';

export const app = new Application({
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById('stage') as HTMLCanvasElement
});

await Db.delete(); // [TODO]
await Db.open();

export const zone = // [TODO]
  new Zone((
    await Db.worlds.get(
      await
      Db
      .worlds
      .add(new World({
        name: Math.random().toString(36).substring(2, 8),
        chunkcount: 0
      }))
    )
  )!);

export const camera = new Camera();

export const profiler = new Profiler();

export const appProfiles =
  new BitmapText(
    '',
    {
      fontName: uiFontName,
      align: 'left'
    }
  );

export const cameraProfiles =
  new BitmapText(
    '',
    {
      fontName: uiFontName,
      align: 'left'
    }
  );
