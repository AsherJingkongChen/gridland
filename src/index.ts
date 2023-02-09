import {
  Application,
  BitmapText,
} from 'pixi.js';
import { Camera, statsPanel } from './camera/Camera';
import { TileScene } from './scene/TileScene';
import { StatsPanel } from './panel/StatsPanel';

const app = new Application({
  view: document.getElementById('stage') as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x000000,
  // resizeTo: window
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
const stats = new StatsPanel();

app.stage.addChild(camera);
app.stage.addChild(stats);
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
