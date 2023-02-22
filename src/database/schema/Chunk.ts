import { WorldIndex } from './World';

export interface ChunkIndex {
  readonly id?: number;
  readonly createdate: Date;
  world: WorldIndex;
  x: number;
  y: number;
};

export interface ChunkData {
};

export type IChunk = ChunkIndex & ChunkData;

export class Chunk implements IChunk {
  public readonly id?: number;
  public readonly createdate: Date;
  public world: WorldIndex;
  public x: number;
  public y: number;

  constructor(
      options: {
        world: WorldIndex,
        x: number,
        y: number
      }
    ) {

    this.createdate = new Date();
    this.world = options.world;
    this.x = options.x;
    this.y = options.y;
  }
};
