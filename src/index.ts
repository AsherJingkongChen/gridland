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
import { Dexie } from 'dexie';
import {
  Chunk,
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

const updateChunks = () => {
  let { x: oldX, y: oldY } = scene._center;
  let { x: newX, y: newY } = camera;

  newX = newX >> 5;
  newY = newY >> 5;

  if (oldX === newX && oldY === newY) {
    return;
  }

  scene._center.x = newX;
  scene._center.y = newY;

  const worldid = scene.view.id;

  Db.transaction(
    'readwrite',
    Db.chunks,
    async () => {
      const newZone = new Map<symbol, Vec2>();

      for (let x = newX - 3; x <= newX + 3; x++) {
        for (let y = newY - 3; y <= newY + 3; y++) {
          const v = new Vec2({ x, y });
          newZone.set(v.symbol, v);
        }
      }

      const loads = await
        Dexie.Promise.all(
          [...newZone].map(([ posSymbol, pos ]) => {
            if (scene.zone.has(posSymbol)) {
              return;
            }

            const { x, y } = pos;
            return (
              Db.readChunk(
                { worldid, x, y }
              )
              .then((chunk) => {
                return (
                  (chunk) ?
                  [posSymbol, chunk] :
                  [
                    posSymbol,
                    Db.createChunk(
                      { worldid, x, y }
                    )
                  ]
                );
              })
            );
          })
        );

      const unloads = await
        Dexie.Promise.all(
          [...scene.zone].map(([ posSymbol, chunk ]) => {
            if (newZone.has(posSymbol)) {
              return;
            }

            return (
              Db.updateChunk(chunk)
                .then(() => posSymbol)
            );
          })
        );

      for (const [posSymbol, chunk] of loads) {
        scene.zone.set(posSymbol, chunk);
      }

      for (const posSymbol of unloads) {
        scene.zone.delete(posSymbol);
      }

      ////////

      // for (const [symbolPos, pos] of newZone) {
      //   if (! scene.zone.has(symbolPos)) {
      //     const { x, y } = pos;

      //     let chunk = await
      //       Db.readChunk({
      //         worldid, x, y
      //       });

      //     if (! chunk) {
      //       chunk = await
      //         Db.createChunk({
      //           worldid, x, y
      //         });
      //     }

      //     scene.zone.set(symbolPos, chunk);
      //   }
      // }

      // for (const [symbolPos, chunk] of scene.zone) {
      //   if (! newZone.has(symbolPos)) {
      //     await Db.updateChunk(chunk);
      //     scene.zone.delete(symbolPos);
      //   }
      // }

      console.log({
        cache: scene.zone.size,
        store: await Db.chunks.count()
      });
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
