import { app, Camera } from '../component';

export const onCameraMove = (camera: Camera) => {
  if (!app.zone) {
    return;
  }

  const {
    pixelPerGridHorizontal,
    pixelPerGridVertical,
    gridPerChunk
  } = app.zone;

  app.profiler?.list['x'][1](
    `${Math.floor(
      camera.x / pixelPerGridHorizontal
    )} Grid / ` +
      `${(
        camera.x /
        pixelPerGridHorizontal /
        gridPerChunk
      ).toFixed(2)} Chunk`
  );
  app.profiler?.list['y'][1](
    `${Math.floor(
      camera.y / pixelPerGridVertical
    )} Grid / ` +
      `${(
        camera.y /
        pixelPerGridVertical /
        gridPerChunk
      ).toFixed(2)} Chunk`
  );
};

export const onCameraZoom = (camera: Camera) => {
  app.profiler?.list['zoom'][1](camera.zoom.toFixed(3));
};
