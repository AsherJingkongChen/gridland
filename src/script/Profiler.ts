import { camera, profiles } from '../component';
import { PixelPerChunk, PixelPerGrid } from '../entity';

const _lengthFormatter = (pixel: number) =>
  `${Math.floor(pixel / PixelPerGrid)} Grid, ` +
  `${(pixel / PixelPerChunk).toFixed(2)} Chunk`;

export const onCameraMove = () => {
  profiles.set.x(_lengthFormatter(camera.x));
  profiles.set.y(_lengthFormatter(camera.y));
};

export const onCameraZoom = () => {
  profiles.set.zoom(camera.zoom.toFixed(3));
};
