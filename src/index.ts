import { render } from 'solid-js/web';
import { app, camera, profiler, zone } from './component';
import {
  closeApp,
  updateChunks,
  updateChunksHelper,
  updateFps,
  onCameraMove,
  onCameraZoom
} from './script';

app.stage.addChild(camera);

camera.stage = zone;
camera.x -= window.innerWidth / 2;
camera.y -= window.innerHeight / 2;

await updateChunksHelper();
onCameraMove();
onCameraZoom();

// [TODO end]

app.ticker.add(updateFps);
camera.event
  .on('move', onCameraMove)
  .on('zoom', onCameraZoom)
  .on('move', updateChunks);
window.addEventListener('beforeunload', closeApp, {
  once: true
});

render(
  profiler.render,
  document.getElementById('overstage') as HTMLDivElement
);
