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
import { WorldScene } from './scene/WorldScene';
import {
  Db,
  HasXY,
  World
} from './database';

const app = new Application({
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  view: document.getElementById('stage') as HTMLCanvasElement
});

const ingrid = (pixel: number) => pixel >> 5;
// const inpixel = (grid: number) => grid << 5;

// 2^15 = 2^(5 + 6 + 4); P/G, G/C, C/L (7 + 1 + 7)
const gridLightTexture =
  Texture.from(
    'grid_light.png',
    {
      scaleMode: SCALE_MODES.NEAREST,
      mipmap: MIPMAP_MODES.ON
    }
  );

// [TODO]
await Db.delete();
await Db.open();

const scene =
  new WorldScene(
    await Db.worlds.get(
      await Db.worlds.add(new World({ name: 'hachime' }))
    ) as World
  );

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

const updateChunk = () => {
  let { x: oldX, y: oldY } = scene._center;
  let { x: newX, y: newY } = camera;
  const worldid = scene.world.id;

  newX = newX >> 5;
  newY = newY >> 5;

  if (oldX === newX && oldY === newY) {
    return;
  }

  scene._center = { x: newX, y: newY };

  const newXYs = new Set<HasXY>();

  for (let x = newX - 3; x <= newX + 3; x++) {
    for (let y = newY - 3; y <= newY + 3; y++) {
      newXYs.add({ x, y });
    }
  }

  Db.transaction(
      'readwrite',
      Db.chunks,
      async () => {
        for (const xy of newXYs) {
          const { x, y } = xy;
          if (! scene.chunks.has(xy)) {
            let chunk = await
              Db.readChunk({
                worldid, x, y
              });

            if (chunk === undefined) {
              chunk = await
                Db.createChunk({
                  worldid, x, y
                });
            }
            scene.chunks.set(xy, chunk);
          }
        }

        for (const [xy, chunk] of scene.chunks) {
          if (! newXYs.has(xy)) {
            await Db.updateChunk(chunk);
            scene.chunks.delete(xy);
          }
        }
      }
  );
};

updateAppStats();
updateCameraStats();
resizeStatsPanel();

cameraStats.position.y = appStats.height;

window.addEventListener('resize', resizeStatsPanel);
app.ticker.add(updateAppStats);
camera.event
  .on('move', updateCameraStats)
  .on('zoom', updateCameraStats)
  .on('move', updateChunk);

// await Db.delete();
