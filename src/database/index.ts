import { Table } from 'dexie';
import { CompactDexieDb } from './CompactDexieDb';
import {
  Chunk,
  World
} from './schema';

export const Db = new class extends CompactDexieDb {
  public get Chunk(): Table<Chunk> {
    return this.table(Chunk.name);
  }

  public get World(): Table<World> {
    return this.table(World.name);
  }

  constructor() {
    super({
      database: 'Db',
      version: 1,
      schemas: [
        {
          type: Chunk,
          index: '++&primkey, createdate,' +
                 'position, world'
        },
        {
          type: World,
          index: '++&primkey, createdate'
        }
      ]
    });
  }
}();
