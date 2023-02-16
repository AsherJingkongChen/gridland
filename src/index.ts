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
import { deserialize } from './tool/Deserialize';

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

// [TODO]
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
const appStats =
  new BitmapText(
    '',
    {
      fontName: StatsPanel.FontName,
      align: 'left'
    }
  );
const cameraStats =
  new BitmapText(
    '',
    {
      fontName: StatsPanel.FontName,
      align: 'left'
    }
  );

app.stage.addChild(
  camera,
  statsPanel.addChild(
    cameraStats,
    appStats).parent
);

statsPanel.event.on(
  'resize',
  () => {
    cameraStats.position.y = appStats.height;
  }
);

app.ticker.add(() => {
  appStats.text =
    deserialize({
      fps: Math.round(app.ticker.FPS),
      renderer: app.renderer.rendererLogId,
      version: `0.0.5`,
    })
    .replaceAll('"', '');
});

camera.event.on(
  'update',
  (camera) => {
    let { x, y, zoom } = camera;
    let { width: w, height: h } = camera.canvas;

    cameraStats.text =
      deserialize({
        camera: {
          canvas: {
            width: `${w} (${ingrid(w)})`,
            height: `${h} (${ingrid(h)})`
          },
          x: `${x.toFixed(1)} (${ingrid(x)})`,
          y: `${y.toFixed(1)} (${ingrid(y)})`,
          zoom: zoom.toFixed(2)
        },
      })
      .replaceAll('"', '');
  }
);
camera.event.emit('update', camera);
