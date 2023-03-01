export const PixelPerGrid = 32;
export const GridPerChunk = 64;
export const ChunkPerZone = 8;

/**
 * 2048
 */
export const PixelPerChunk = PixelPerGrid * GridPerChunk;

/**
 * 4
 */
export const HalfChunkPerZone = Math.trunc(
  ChunkPerZone / 2
);
