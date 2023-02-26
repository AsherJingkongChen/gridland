import {
  Db,
} from './database';
import {
  app,
  appProfiles,
  camera,
  cameraProfiles,
  chunk,
  chunk2,
  profiler,
  zone
} from './component';
import {
  resizeProfiler,
  updateAppProfiles,
  updateCameraProfiles,
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
  appProfiles,
  cameraProfiles
);

zone.addChild( //
  chunk,
  chunk2
);

camera.stage = zone;
camera.x -= window.innerWidth / 2;
camera.y -= window.innerHeight / 2;

chunk2.x = chunk.x - chunk2.width; // [TODO]

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
