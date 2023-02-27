import { BitmapText } from 'pixi.js';
import {
  app,
  appProfiles,
  camera,
  cameraProfiles,
  profiler,
  zone
} from './component';
import { uiFontName } from './resource';
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

const centerPivot =
  new BitmapText(
    '-X-',
    {
      fontName: uiFontName,
      align: 'left',
      tint: 0xa09000,
      fontSize: 10
    }
  );

zone // [TODO]
.getChunkSprite({ x: 0, y: 0 })
?.addChild(centerPivot);

centerPivot.anchor.set(0.5);
// centerPivot.position.set()

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
