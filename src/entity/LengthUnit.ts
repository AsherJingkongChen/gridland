export const PixelPerGrid = 32;
export const GridPerChunk = 64;
export const ChunkPerZone = 16;

/**
 * 2048
 */
export const PixelPerChunk =
  PixelPerGrid * GridPerChunk;

/**
 * 8
 */
export const HalfChunkPerZone =
  Math.trunc(ChunkPerZone / 2);
