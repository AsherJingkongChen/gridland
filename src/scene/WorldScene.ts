import {
  Container,
  IPointData
} from 'pixi.js';
import {
  Chunk,
  WorldIndex
} from '../database/schema';
import { Db } from '../database/index';

export interface IWorldScene {
  loadedChunks: Chunk[];
  world: WorldIndex;
};

export class WorldScene extends Container
implements IWorldScene {

  public loadedChunks: Chunk[];
  public world: WorldIndex;

  constructor(world: WorldIndex) {
    super();

    this.loadedChunks = [];
    this.world = world;
  }

  public async getChunks(_coordinates: IPointData[]): Promise<Chunk[]> {
    Db.chunks
      .where('world.id')
      .equals(this.world.id!);
    
    return [];
  }

  public async setChunks(_chunks: Chunk[]) {

  }
};
