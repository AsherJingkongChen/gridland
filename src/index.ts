import {
  Application,
  Ticker,
  TilingSprite,
  SCALE_MODES,
  MIPMAP_MODES,
  Texture,
  Container
} from 'pixi.js';
import { Camera } from './camera';
import {
  StatsPanel,
  Stats
} from './panel';

const app = new Application({
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById('stage') as HTMLCanvasElement,
});

const ingrid = (pixel: number) => pixel >> 5;
// const inpixel = (grid: number) => grid << 5;

// 2^15 = 2^(5 + 6 + 4); P/G, G/C, C/L

const gridTexture =
  Texture.from(
    'grid.png',
    {
      scaleMode: SCALE_MODES.NEAREST,
      mipmap: MIPMAP_MODES.ON
    }
  );

const scene = new Container(); //
const chunk =
  TilingSprite.from(
    gridTexture,
    {
      width: 1 << 5 << 6,
      height: 1 << 5 << 6,
    }
  );
const chunk2 =
  TilingSprite.from(
    gridTexture,
    {
      width: 1 << 5 << 6,
      height: 1 << 5 << 6
    }
  );
scene.addChild(chunk); //
scene.addChild(chunk2); //
chunk2.x = chunk.x - chunk2.width; //

const camera = new Camera({ canvas: scene }); //
camera.x -= window.innerWidth / 2; //
camera.y -= window.innerHeight / 2; //

const statsPanel = new StatsPanel(window);
const systeminfo = 
  `version 0.0.5\n` +
  `${app.renderer.rendererLogId}`;
const systemStats =
  new Stats(
    (stats, panel) => {
      stats.position.x = panel.width - stats.textWidth;
      return systeminfo;
    },
    { align: 'right' }
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
        .replaceAll('"', '')
      );
    }
  );

app.stage.addChild(
  camera,
  statsPanel
    .observe(systemStats)
    .observe(devStats)
);
