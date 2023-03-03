import { camera, profiles, zone } from '../component';
import { Chunk, db } from '../database';
import {
  ChunkPerZone,
  HalfChunkPerZone,
  PixelPerChunk,
  Vec2
} from '../entity';

export const updateChunks = async () => {
  const newCX = Math.floor(camera.x / PixelPerChunk);
  const newCY = Math.floor(camera.y / PixelPerChunk);

  if (newCX === zone.center.x && newCY === zone.center.y) {
    return;
  }

  zone.center.x = newCX;
  zone.center.y = newCY;

  db.transaction(
    'readwrite',
    db.chunks,
    updateChunksHelper
  );
};

export const updateChunksHelper = async () => {
  const worldid = zone.world.id;
  const newChunksPos = new Map<string, Vec2>();
  const oldChunks = zone.getChunks();

  const xmin = zone.center.x - HalfChunkPerZone;
  const ymin = zone.center.y - HalfChunkPerZone;
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
      profiles.set.chunks(zone.getChunks().size);
    }
  }

  for (const [key, { x, y }] of newChunksPos) {
    if (!oldChunks.has(key)) {
      const option = { worldid, x, y };
      let chunk = await Chunk.Read(option);
      if (!chunk) {
        chunk = await Chunk.Create(option);
      }

      zone.setChunk(chunk);
      profiles.set.chunks(zone.getChunks().size);
    }
  }
};
