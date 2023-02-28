import {
  Table,
  Dexie,
} from 'dexie';
import {
  Chunk,
  World,
} from './schema';

export const Db = new class Db extends Dexie {
  public get chunks():
      Table<Chunk, [number, number, number]> {

    return this.table(Chunk.name);
  }

  public get worlds(): Table<World, number> {
    return this.table(World.name);
  }

  constructor() {
    super('Db');

    this
    .version(1)
    .stores(
      Object.fromEntries([
        [ Chunk.name, Chunk.Indexes ],
        [ World.name, World.Indexes ]
      ])
    );

    this.chunks.mapToClass(Chunk);
    this.worlds.mapToClass(World);
  }
}();

console.log(Db); // [LOG]

export * from './schema';
