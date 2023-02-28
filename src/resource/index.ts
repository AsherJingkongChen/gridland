import {
  SCALE_MODES,
  MIPMAP_MODES,
  Texture,
  BitmapFont
} from 'pixi.js';

export const gridLightTexture = Texture.from(
  'grid_light.png',
  {
    scaleMode: SCALE_MODES.NEAREST,
    mipmap: MIPMAP_MODES.ON
  }
);

export const uiFontName = 'uifont';

BitmapFont.from(
  uiFontName,
  {
    fontFamily: 'Monaco',
    fontSize: 12,
    fontWeight: 'normal',
    fill: 0xffffff
  },
  { chars: BitmapFont.ASCII }
);
