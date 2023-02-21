import {
  Application,
  TilingSprite,
  SCALE_MODES,
  MIPMAP_MODES,
  Texture,
  Container,
  BitmapText
} from 'pixi.js';
import { Camera } from './camera';
import { StatsPanel } from './panel';
import { serialize } from './tool';

const app = new Application({
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById('stage') as HTMLCanvasElement
});

const ingrid = (pixel: number) => pixel >> 5;
// const inpixel = (grid: number) => grid << 5;

// 2^15 = 2^(5 + 6 + 4); P/G, G/C, C/L

const gridLightTexture =
  Texture.from(
    'grid_light.png',
    {
      scaleMode: SCALE_MODES.NEAREST,
      mipmap: MIPMAP_MODES.ON
    }
  );

// [TODO]
const scene = new Container(); //
const chunk =
  TilingSprite.from(
    gridLightTexture,
    {
      width: 1 << 5 << 6,
      height: 1 << 5 << 6,
    }
  );
const chunk2 =
  TilingSprite.from(
    gridLightTexture,
    {
      width: 1 << 5 << 6,
      height: 1 << 5 << 6
    }
  );
chunk2.x = chunk.x - chunk2.width; //

const camera = new Camera({ scene });
camera.x -= window.innerWidth / 2;
camera.y -= window.innerHeight / 2;

const statsPanel = new StatsPanel();
const appStats =
  new BitmapText(
    '',
    {
      fontName: StatsPanel.DefaultFontName,
      align: 'left'
    }
  );
const cameraStats =
  new BitmapText(
    '',
    {
      fontName: StatsPanel.DefaultFontName,
      align: 'left'
    }
  );

const resizeStatsPanel = () => {
  const { innerWidth, innerHeight } = window;
  statsPanel.resize(innerWidth, innerHeight);
};

const updateAppStats = () => {
  appStats.text =
    serialize({
      fps: Math.round(app.ticker.FPS),
      renderer: app.renderer.rendererLogId,
      version: `0.0.6`
    })
    .replaceAll('"', '');
};

const updateCameraStats = () => {
  const { x, y, zoom } = camera;
  const { width: w, height: h } = camera.scene as Container;

  cameraStats.text =
    serialize({
      camera: {
        scene: {
          width: `${w} (${ingrid(w)})`,
          height: `${h} (${ingrid(h)})`
        },
        x: `${x.toFixed(1)} (${ingrid(x)})`,
        y: `${y.toFixed(1)} (${ingrid(y)})`,
        zoom: zoom.toFixed(2)
      }
    })
    .replaceAll('"', '');
};

app.stage.addChild(
  camera,
  statsPanel.addChild(
    appStats,
    cameraStats)
  .parent
);
scene.addChild( //
  chunk,
  chunk2
);

updateAppStats();
updateCameraStats();
resizeStatsPanel();

cameraStats.position.y = appStats.height;

window.addEventListener('resize', resizeStatsPanel);
app.ticker.add(updateAppStats);
camera.event
  .on('move', updateCameraStats)
  .on('zoom', updateCameraStats);

import { Db } from './database';
import { Chunk, World } from './database/schema';

console.log(Db);

await
  Db.transaction(
    'rw',
    Db.Chunk, Db.World,
    async () => {
      const world =
        await Db.World.get(
          await Db.World.add(new World())
        );

      const chunk =
        await Db.Chunk.get(
          await Db.Chunk.add(new Chunk({ world }))
        );

      console.log({world, chunk});
    }
  );

console.log(Db);

await Db.delete();
