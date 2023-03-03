import {
  SCALE_MODES,
  MIPMAP_MODES,
  Texture
} from 'pixi.js';

export const gridLightTexture = Texture.from(
  './asset/grid_light.png',
  {
    scaleMode: SCALE_MODES.NEAREST,
    mipmap: MIPMAP_MODES.ON
  }
);
