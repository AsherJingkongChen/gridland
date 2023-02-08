import {
  Application,
  BitmapText,
  Container,
} from 'pixi.js';
import { Camera, statsPanel } from './camera/Camera';
import { TileScene } from './scene/TileScene';

const app = new Application({
  view: document.getElementById('canvas_1') as HTMLCanvasElement,
  resolution: 1,
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  width: 300,
  height: 400
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

const t = new Container();
const camera = new Camera(new TileScene(0, 0, 4096, 4096, colorMap()));

app.stage.addChild(t).addChild(camera);
app.stage.addChild(statsPanel);

// [TODO]
const versionPanel =
  new BitmapText(
    'version 0.0.2',
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
