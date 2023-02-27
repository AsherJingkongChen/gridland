export const PixelPerGrid = 32;
export const GridPerChunk = 2;
export const ChunkPerZone = 5;

/**
 * 2
 */
export const HalfChunkPerZone =
  Math.trunc(ChunkPerZone / 2);

/**
 * 64
 */
export const PixelPerChunk =
  PixelPerGrid * GridPerChunk;
