import {
  Application,
  BitmapText,
  TilingSprite
} from "pixi.js";
import { Zone } from './Zone';
import {
  Db,
  World
} from '../database';
import {
  gridLightTexture,
  uiFontName
} from "../asset";
import { Camera } from "./Camera";
import { Profiler } from './Profiler';

export const app = new Application({
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById('stage') as HTMLCanvasElement
});

export const zone = // [TODO]
  new Zone(
    await Db.worlds.get(
      await
      Db
      .worlds
      .add(new World({ name: 'hachime' }))
    ) as World
  );

export const chunk =
  TilingSprite.from(
    gridLightTexture,
    {
      width: 1 << 5 << 6,
      height: 1 << 5 << 6,
    }
  );

export const chunk2 =
  TilingSprite.from(
    gridLightTexture,
    {
      width: 1 << 5 << 6,
      height: 1 << 5 << 6
    }
  );

export const camera = new Camera();

export const profiler = new Profiler();

export const appInfo =
  new BitmapText(
    '',
    {
      fontName: uiFontName,
      align: 'left'
    }
  );

export const cameraInfo =
  new BitmapText(
    '',
    {
      fontName: uiFontName,
      align: 'left'
    }
  );