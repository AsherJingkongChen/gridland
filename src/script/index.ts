import { Container } from 'pixi.js';
import {
  app,
  appProfiles,
  camera,
  cameraProfiles,
  profiler,
  zone
} from '../component';
import { serialize } from '../tool';
import {
  Vec2,
  Vec2Symbol,
  ChunkPerZone,
  HalfChunkPerZone,
  PixelPerChunk,
  PixelPerGrid
} from '../entity';
import { Chunk, Db } from '../database';

export const resizeProfiler = () => {
  const { innerWidth, innerHeight } = window;
  profiler.resize(innerWidth, innerHeight);
};

export const updateAppProfiles = () => {
  appProfiles.text = serialize({
    fps: Math.round(app.ticker.FPS),
    renderer: app.renderer.rendererLogId,
    version: `0.0.6`,
    chunks: zone.getChunks().size
  }).replaceAll('"', '');
};

const lengthLiteral = (pixel: number) => {
  return (
    `{ ` +
    `${Math.floor(pixel)}P, ` +
    `${Math.floor(pixel / PixelPerGrid)}G, ` +
    `${(pixel / PixelPerChunk).toFixed(1)}C` +
    ` }`
  );
};

export const updateCameraProfiles = () => {
  const { x, y, zoom } = camera;
  const { width, height } = camera.stage as Container;

  cameraProfiles.text = serialize({
    camera: {
      x: lengthLiteral(x),
      y: lengthLiteral(y),
      zoom: zoom.toFixed(3),
      stage: {
        width: lengthLiteral(width),
        height: lengthLiteral(height)
      }
    }
  }).replaceAll('"', '');
};

export const updateChunks = async () => {
  const cx = Math.floor(camera.x / PixelPerChunk);
  const cy = Math.floor(camera.y / PixelPerChunk);

  if (!zone.recenter({ x: cx, y: cy })) {
    return;
  }

  Db.transaction('readwrite', [Db.chunks], async () => {
    return updateChunksAt(cx, cy);
  });
};

export const updateChunksAt = async (cx: number, cy: number) => {
  const worldid = zone.world.id;

  const newChunksPos = new Map<Vec2Symbol, Vec2>();
  const oldChunks = zone.getChunks();
  const xmin = cx - HalfChunkPerZone;
  const ymin = cy - HalfChunkPerZone;
  const xmax = xmin + ChunkPerZone - 1;
  const ymax = ymin + ChunkPerZone - 1;

  for (let x = xmin; x <= xmax; x++) {
    for (let y = ymin; y <= ymax; y++) {
      const pos = new Vec2({ x, y });
      newChunksPos.set(pos.key, pos);
    }
  }

  for (const [key, chunk] of oldChunks) {
    if (!newChunksPos.has(key)) {
      zone.deleteChunk(await Chunk.Update(chunk));
    }
  }

  for (const [key, { x, y }] of newChunksPos) {
    if (!oldChunks.has(key)) {
      let chunk = await Chunk.Read({ worldid, x, y });
      if (!chunk) {
        chunk = await Chunk.Create({ worldid, x, y });
      }

      zone.setChunk(chunk);
    }
  }
};
