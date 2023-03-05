const PixelPerGrid = 32;
const GridPerChunk = 64;
const ChunkPerZone = 8;
const HalfChunkPerZone = Math.floor(ChunkPerZone / 2);
const PixelPerChunk = PixelPerGrid * GridPerChunk;
const PixelPerZone = PixelPerChunk * ChunkPerZone;
const GridPerZone = GridPerChunk * ChunkPerZone;

const GridPerPixel = 1 / PixelPerGrid;
const ChunkPerGrid = 1 / GridPerChunk;
const ZonePerChunk = 1 / ChunkPerZone;
const ChunkPerPixel = 1 / PixelPerChunk;
const ZonePerPixel = 1 / PixelPerZone;
const ZonePerGrid = 1 / GridPerZone;

export const LengthUnit = {
  PixelPerGrid,
  GridPerChunk,
  ChunkPerZone,
  PixelPerChunk,
  PixelPerZone,
  GridPerZone,
  HalfChunkPerZone,
  GridPerPixel,
  ChunkPerGrid,
  ZonePerChunk,
  ChunkPerPixel,
  ZonePerPixel,
  ZonePerGrid
} as const;
