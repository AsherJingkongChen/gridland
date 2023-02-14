import {
  Application,
  Ticker,
  TilingSprite,
  SCALE_MODES,
  MIPMAP_MODES,
} from 'pixi.js';
import { Camera } from './camera';
import {
  StatsPanel,
  Stats
} from './panel';

const app = new Application({
  view: document.getElementById('stage') as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window
});

const ingrid = (pixel: number) => pixel >> 5;
// const inpixel = (grid: number) => grid << 5;

// 2^15 = 2^(5 + 5 + 5); P/G, G/C, C/L

// [TODO] load from spritesheet
const chunk =
  TilingSprite.from(
    `grid.png`,
    {
      width: 1 << 5 << 5,
      height: 1 << 5 << 5,
      scaleMode: SCALE_MODES.NEAREST,
      mipmap: MIPMAP_MODES.ON
    }
  );

const camera = new Camera(chunk);

const statsPanel = new StatsPanel(window);
const versionStats =
  new Stats(
    (stats, panel) => {
      stats.position.x = panel.width - stats.textWidth;
      return 'version 0.0.5';
    }
  );
const devStats =
  new Stats(
    () => {
      let { x, y, zoom } = camera;
      let { width: w, height: h } = camera.canvas;

      return (
        JSON.stringify(
          {
            fps: Math.trunc(Ticker.shared.FPS),
            camera: {
              x: `${x.toFixed(1)} (${ingrid(x)})`,
              y: `${y.toFixed(1)} (${ingrid(y)})`,
              zoom: zoom.toFixed(2)
            },
            canvas: {
              width: `${w} (${ingrid(w)})`,
              height: `${h} (${ingrid(h)})`
            }
          },
          null,
          2
        )
        .replace(/"/g, '')
      );
    }
  );

app.stage.addChild(
  camera,
  statsPanel
    .observe(versionStats)
    .observe(devStats)
);
