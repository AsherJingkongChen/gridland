import { Chunk, db } from '../database';
import { Vec2 } from '../entity';
import { Component, Camera } from '../component';

export const updateChunks = async (camera: Camera) => {
  if (!Component.zone) {
    return;
  }
  const zone = Component.zone;
  const {
    pixelPerGridHorizontal,
    pixelPerGridVertical,
    gridPerChunk
  } = zone;

  const newCenterX = Math.floor(
    camera.x / pixelPerGridHorizontal / gridPerChunk
  );
  const newCenterY = Math.floor(
    camera.y / pixelPerGridVertical / gridPerChunk
  );

  if (
    newCenterX === zone.center.x &&
    newCenterY === zone.center.y
  ) {
    return;
  }

  zone.center.x = newCenterX;
  zone.center.y = newCenterY;

  db.transaction('readwrite', db.chunks, _updateChunks);
};

const _updateChunks = async () => {
  if (!Component.zone) {
    return;
  }
  const zone = Component.zone;

  const worldid = zone.worldid;
  const newChunksPos = new Map<string, Vec2>();
  const oldChunks = zone.chunks;

  const xmin =
    zone.center.x - Math.floor(zone.chunkPerZone / 2);
  const ymin =
    zone.center.y - Math.floor(zone.chunkPerZone / 2);
  const xmax = xmin + zone.chunkPerZone - 1;
  const ymax = ymin + zone.chunkPerZone - 1;

  for (let x = xmin; x <= xmax; x++) {
    for (let y = ymin; y <= ymax; y++) {
      const pos = new Vec2({ x, y });
      newChunksPos.set(pos.key, pos);
    }
  }

  for (const [key, chunk] of oldChunks) {
    if (!newChunksPos.has(key)) {
      zone.deleteChunk(await Chunk.Update(chunk));

      Component.profiler?.list['chunks'][1](
        zone.chunks.size.toString()
      );
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

      Component.profiler?.list['chunks'][1](
        zone.chunks.size.toString()
      );
    }
  }
};
