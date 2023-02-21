import {
  IVector,
  Vector 
} from '../../datatype';
import { WorldId } from './World';

export interface ChunkId {
  readonly createdate?: Date;
  readonly primkey?: number;
  position?: IVector;
  world?: WorldId;
};

export interface ChunkData {
};

export type IChunk = ChunkId & ChunkData;

export class Chunk implements IChunk {
  public readonly createdate?: Date;
  public readonly primkey?: number;
  public position?: IVector;
  public world?: WorldId;

  constructor(options?: IChunk) {
    this.createdate = new Date();
    this.position = options?.position || new Vector();
    this.world = options?.world;
  }
};
