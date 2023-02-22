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
const scene =
  new WorldScene(
    await Db.worlds.get(
      await Db.worlds.add(new World({ name: 'hachime' }))
    ) as World
  );

scene.loadedChunks.push(
  new Chunk({
    world: scene.world!,
    x: 0,
    y: 0
  })
);

const updateChunk = async () => {
  // const { loads, unloads } =
  //   scene.requireChunks({
  //     x: camera.x >> 11,
  //     y: camera.y >> 11
  //   });
  const { x: oldX, y: oldY } = scene.loadedChunks[0];
  const { x: newX, y: newY } = camera;
  
  if (oldX === newX && oldY === newY) {
    return;
  }

  const newXs = [newX - 7];
  const newYs = [newY - 7];

  for (let _ = 15; _--;) {
    newXs.push(1 + newXs[newXs.length - 1]);
    newYs.push(1 + newYs[newYs.length - 1]);
  }

  // if toLoad or toUnload is not empty then:
  
  await Db.transaction(
    'rw',
    [
      Db.chunks,
      Db.worlds
    ],
    async () => {
      // Get Db.chunks where [world] and [position]
      // Add and get Db.chunks where [position]
      await Db.chunks
        .add(
          new Chunk({
            world: scene.world!,
            x: 0,
            y: 1
          })
        );

      await scene.getChunks([]);

      // - Disk: Db.chunks
      // - Mem: scene.loadedChunks
      //
      // - Responses:
      // - load
      //   - not in Db.chunks => new chunks => put and get
      //   - in Db.chunks     => old chunks => get
      // - unload             => old chunks => put
      
    }
  );
  
};

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

updateAppStats();
updateCameraStats();
resizeStatsPanel();

cameraStats.position.y = appStats.height;

window.addEventListener('resize', resizeStatsPanel);
app.ticker.add(updateAppStats);
camera.event
  .on('move', updateCameraStats)
  .on('zoom', updateCameraStats)
  // .on('move', updateChunk);

// await
//   Db.transaction(
//     'readonly',
//     Db.tables,
//     async () => {
//       for (const table of Db.tables) {
//         await table.each((x) => console.log(x));
//       }
//     }
//   );

await updateChunk();
await Db.delete();
