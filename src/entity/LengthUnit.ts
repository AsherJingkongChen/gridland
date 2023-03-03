export const PixelPerGrid = 32;
export const GridPerChunk = 128;
export const ChunkPerZone = 8;

export const PixelPerChunk = PixelPerGrid * GridPerChunk;
export const PixelPerZone = PixelPerChunk * ChunkPerZone;
export const GridPerZone = GridPerChunk * ChunkPerZone;
export const HalfChunkPerZone = Math.floor(
  ChunkPerZone / 2
);
