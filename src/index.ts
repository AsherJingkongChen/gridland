import { BitmapText } from 'pixi.js';
import { uiFontName } from './resource';
import { PixelPerChunk } from './tool/LengthUnit';
import {
  app,
  appProfiles,
  camera,
  cameraProfiles,
  profiler,
  zone
} from './component';
import {
  resizeProfiler,
  updateAppProfiles,
  updateCameraProfiles,
  updateChunks,
  updateChunksAt,
} from './script';

app.stage.addChild(
  camera,
  profiler
);

profiler.addChild(
  appProfiles,
  cameraProfiles
);

camera.stage = zone;
camera.x -= window.innerWidth / 2;
camera.y -= window.innerHeight / 2;

await updateChunksAt(0, 0);

// [TODO]
const centerPivot =
  new BitmapText(
    '-X-',
    {
      fontName: uiFontName,
      align: 'left',
      tint: 0xccaa00,
      fontSize: 10
    }
  );

zone
.getChunkSprite({ x: 0, y: 0 })
?.addChild(centerPivot);

centerPivot.anchor.set(0.5);

centerPivot.position
.set(Math.trunc(PixelPerChunk / 2));
// [TODO end]

updateAppProfiles();
updateCameraProfiles();
resizeProfiler();

cameraProfiles.position.y = appProfiles.height;

camera.event
.on('move', updateCameraProfiles)
.on('zoom', updateCameraProfiles)
.on('move', updateChunks);

window.addEventListener('resize', resizeProfiler);
app.ticker.add(updateAppProfiles);
