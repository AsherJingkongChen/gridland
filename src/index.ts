import {
  Application,
} from 'pixi.js';
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
const cameraStats =
  new Stats(
    () => {
      return JSON.stringify(
        {
          x: camera.x.toFixed(2),
          y: camera.y.toFixed(2),
          zoom: camera.zoom.toFixed(2),
          canvas: {
            w: camera.canvas.width.toFixed(2),
            h: camera.canvas.height.toFixed(2)
          }
        },
        null,
        2
      );
    }
  );

statsPanel.addOne(cameraStats);
statsPanel.addOne(
  new Stats(
    () => 'version 0.0.3',
    (stats, panel) => {
      stats.position.x = panel.size.x - stats.textWidth;
    }
  )
);

app.stage.addChild(camera);
app.stage.addChild(statsPanel);
