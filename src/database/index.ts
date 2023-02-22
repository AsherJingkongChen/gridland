import { Table, Dexie } from 'dexie';
import {
  Chunk,
  World
} from './schema';

export const Db = new class extends Dexie {
  public get chunks(): Table<Chunk, number> {
    return this.table(Chunk.name);
  }

  public get worlds(): Table<World, number> {
    return this.table(World.name);
  }

  constructor() {
    super('Db');

    this.version(1)
        .stores(
          Object.fromEntries([
            [
              World.name,
              '++&id, ' +
              'createdate, name'
            ],
            [
              Chunk.name,
              '++&id, ' +
              'createdate, ' +
              'world.id, world.createdate, world.name, ' +
              'x, y'
            ]
          ])
        );

    this.worlds.mapToClass(World);
    this.chunks.mapToClass(Chunk);
  }
}();

export * from './schema';
