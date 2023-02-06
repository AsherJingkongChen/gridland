import {
  Application,
  BitmapText
} from 'pixi.js';
import { Camera, statsPanel } from './camera/camera';
import { TileScene } from './scene/tile_scene';

const app = new Application({
  view: document.getElementById('canvas_1') as HTMLCanvasElement,
  resolution: 1,
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

const camera = new Camera(new TileScene(0, 0, 2048, 2048, colorMap()));
app.stage.addChild(camera);
camera.globalX = window.innerWidth / 2;
camera.globalY = window.innerHeight / 2;

app.stage.addChild(statsPanel);

const versionPanel =
  new BitmapText(
    'version 0.0.1',
    {
      fontName: 'Stats',
      align: 'right'
    }
  );
app.stage.addChild(versionPanel);

versionPanel.position.x = window.innerWidth - versionPanel.textWidth;

window.addEventListener('resize', () => {
  versionPanel.position.x = window.innerWidth - versionPanel.textWidth;
});

