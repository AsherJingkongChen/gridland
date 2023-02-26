import {
  Db,
} from './database';
import {
  app,
  appInfo,
  camera,
  cameraInfo,
  chunk,
  chunk2,
  profiler,
  zone
} from './component';
import {
  resizeProfiler,
  updateAppInfo,
  updateCameraInfo,
  updateChunks
} from './script';

// const inpixel = (grid: number) => grid << 5;

// 2^15 = 2^(5 + 6 + 4); P/G, G/C, C/Z (7 + 1 + 7)

// [TODO]
await Db.delete();
await Db.open();

app.stage.addChild(
  camera,
  profiler
);

profiler.addChild(
  appInfo,
  cameraInfo
);

zone.addChild( //
  chunk,
  chunk2
);

camera.stage = zone;
camera.x -= window.innerWidth / 2;
camera.y -= window.innerHeight / 2;

chunk2.x = chunk.x - chunk2.width; // [TODO]

updateAppInfo();
updateCameraInfo();
resizeProfiler();

cameraInfo.position.y = appInfo.height;

camera.event
.on('move', updateCameraInfo)
.on('zoom', updateCameraInfo)
.on('move', updateChunks);

window.addEventListener('resize', resizeProfiler);
app.ticker.add(updateAppInfo);
