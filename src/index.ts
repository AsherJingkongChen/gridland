import { Application, Ticker } from 'pixi.js';
import { Camera } from './camera';
import { TileScene } from './scene';
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

function colorMap() {
  const result: number[][] = [];

  for (let r = 0; r < 50; r++) {
    result.push([]);
    for (let c = 0; c < 50; c++) {
      result[r].push(Math.random() * 0xffffff);
    }
  }
  return result;
};

const camera = new Camera(new TileScene(0, 0, 4096, 4096, colorMap()));

const statsPanel = new StatsPanel(window);
const versionStats =
  new Stats(
    (stats, panel) => {
      stats.position.x = panel.width - stats.textWidth;
      return 'version 0.0.4';
    }
  );
const devStats =
  new Stats(
    () =>
      JSON.stringify(
        {
          fps: Math.trunc(Ticker.shared.FPS),
          camera: {
            x: camera.x.toFixed(2),
            y: camera.y.toFixed(2),
            zoom: camera.zoom.toFixed(2),
            canvas: {
              w: camera.canvas.width.toFixed(2),
              h: camera.canvas.height.toFixed(2)
            }
          }
        },
        null,
        2
      )
      .replace(/"/g, '')
  );

app.stage.addChild(
  camera,
  statsPanel
    .observe(versionStats)
    .observe(devStats)
);
