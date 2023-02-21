import { ChunkId } from './Chunk';

export interface WorldId {
  readonly createdate?: Date;
  readonly primkey?: number;
};

export interface WorldData {
  chunks?: ChunkId[];
};

export type IWorld = WorldId & WorldData;

export class World implements IWorld {
  public readonly createdate?: Date;
  public readonly primkey?: number;
  public chunks?: ChunkId[];

  constructor(options?: IWorld) {
    this.createdate = new Date();
    this.chunks = options?.chunks || [];
  }
};
