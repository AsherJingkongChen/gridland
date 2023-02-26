import {
  Container,
} from 'pixi.js';
import {
  app,
  appInfo,
  camera,
  cameraInfo,
  profiler,
  zone,
} from '../component';
import {
  serialize,
} from '../tool';
import {
  Vec2,
} from '../entity';
import {
  Db,
} from '../database';

const ingrid = (pixel: number) => pixel >> 5;

export const resizeProfiler = () => {
  const { innerWidth, innerHeight } = window;
  profiler.resize(innerWidth, innerHeight);
};

export const updateAppInfo = () => {
  appInfo.text =
    serialize({
      fps: Math.round(app.ticker.FPS),
      renderer: app.renderer.rendererLogId,
      version: `0.0.6`,
      chunks: zone.chunks.size
    })
    .replaceAll('"', '');
};

export const updateCameraInfo = () => {
  const { x, y, zoom } = camera;
  const { width: w, height: h } =
    camera.stage as Container;

  cameraInfo.text =
    serialize({
      camera: {
        stage: {
          width: `${w} (${ingrid(w)})`,
          height: `${h} (${ingrid(h)})`
        },
        x: `${x.toFixed(1)} (${ingrid(x)})`,
        y: `${y.toFixed(1)} (${ingrid(y)})`,
        zoom: zoom.toFixed(2)
      }
    })
    .replaceAll('"', '');
};

export const updateChunks = async () => {
  let { x: oldX, y: oldY } = zone._center;
  let { x: newX, y: newY } = camera;
  const worldid = zone.world.id;

  newX = newX >> 5; // [TODO]
  newY = newY >> 5;

  if (oldX === newX && oldY === newY) {
    return;
  }

  zone._center.x = newX;
  zone._center.y = newY;

  Db.transaction(
    'readwrite',
    [ Db.chunks ],
    async () => {
      const newChunksPos = new Map<symbol, Vec2>();
      const oldChunks = zone.chunks;

      for (let x = newX - 7; x <= newX + 7; x++) {
        for (let y = newY - 7; y <= newY + 7; y++) {
          const vec = new Vec2({ x, y });
          newChunksPos.set(vec.symbol, vec);
        }
      }

      for (const [ key, chunk ] of oldChunks) {
        if (! newChunksPos.has(key)) {
          zone.chunks.delete(key);
          await Db.updateChunk(chunk);
        }
      }

      for (const [ key, { x, y } ] of newChunksPos) {
        if (! oldChunks.has(key)) {
          zone.chunks.set(
            key,
            await Db.getChunk({ worldid, x, y })
          );
        }
      }
    }
  );
};
