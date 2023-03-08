import Dexie, { Table } from 'dexie';
import { Chunk, World } from './schema';

export class DexieDbV1 extends Dexie {
  public get chunks(): Table<Chunk, number> {
    return this.table(Chunk.name);
  }

  public get worlds(): Table<World, number> {
    return this.table(World.name);
  }

  constructor() {
    super('idb');

    this.version(1).stores(
      Object.fromEntries([
        [Chunk.name, Chunk.Indexes],
        [World.name, World.Indexes]
      ])
    );

    this.chunks.mapToClass(Chunk);
    this.worlds.mapToClass(World);
  }
}
