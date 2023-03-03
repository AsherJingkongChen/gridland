import { Table, Dexie } from 'dexie';
import { Chunk, World } from './schema';

export * from './schema';

export const db = new (class db extends Dexie {
  public get chunks(): Table<
    Chunk,
    [number, number, number]
  > {
    return this.table(Chunk.name);
  }

  public get worlds(): Table<World, number> {
    return this.table(World.name);
  }

  constructor() {
    super('db');

    this.version(1).stores(
      Object.fromEntries([
        [Chunk.name, Chunk.Indexes],
        [World.name, World.Indexes]
      ])
    );

    this.chunks.mapToClass(Chunk);
    this.worlds.mapToClass(World);
  }
})();
