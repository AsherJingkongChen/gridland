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
import { Vec2 } from './type/Vec2';
import {
  Db,
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

// 2^15 = 2^(5 + 6 + 4); P/G, G/C, C/Z (7 + 1 + 7)
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
      version: `0.0.6`,
      chunks: scene.chunks.size
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

const updateChunks = async () => {
  let { x: oldX, y: oldY } = scene._center;
  let { x: newX, y: newY } = camera;
  const worldid = scene.view.id;

  newX = newX >> 5;
  newY = newY >> 5;

  if (oldX === newX && oldY === newY) {
    return;
  }

  scene._center.x = newX;
  scene._center.y = newY;

  Db.transaction(
    'readwrite',
    [ Db.chunks ],
    async () => {
      const newChunksPos = new Map<symbol, Vec2>();
      const oldChunks = scene.chunks;

      for (let x = newX - 7; x <= newX + 7; x++) {
        for (let y = newY - 7; y <= newY + 7; y++) {
          const vec = new Vec2({ x, y });
          newChunksPos.set(vec.symbol, vec);
        }
      }

      for (const [ key, chunk ] of oldChunks) {
        if (! newChunksPos.has(key)) {
          scene.chunks.delete(key);
          await Db.updateChunk(chunk);
        }
      }

      for (const [ key, { x, y } ] of newChunksPos) {
        if (! oldChunks.has(key)) {
          scene.chunks.set(
            key,
            await Db.getChunk({ worldid, x, y })
          );
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
  .on('move', updateChunks);
