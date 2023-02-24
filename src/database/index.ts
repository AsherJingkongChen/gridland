import {
  Table,
  Dexie
} from 'dexie';
import {
  Chunk,
  IChunk,
  World
} from './schema';

export const Db = new class Db extends Dexie {
  public get chunks(): Table<Chunk, number> {
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

  public async getChunk(options: IChunk) {
    const oldChunk = await this.readChunk(options);
    if (oldChunk) { return oldChunk; }

    const newChunk = new Chunk(options);
    await this.chunks.add(newChunk);
    return newChunk;
  }

  public async readChunk(idOrOptions: number | IChunk) {
    if (typeof idOrOptions === 'number') {
      return this.chunks.get(idOrOptions);

    } else {
      const { worldid, x, y } = idOrOptions;
      return this.chunks.get({ worldid, x, y });
    }
  }

  public async updateChunk(chunk: Chunk) {
    await this.chunks.put(chunk);
    return chunk;
  }

  public async deleteChunk(idOrOptions: number | IChunk) {
    const chunk = await this.readChunk(idOrOptions);
    if (! chunk) { return; }

    await this.chunks.delete(chunk.id);
    return chunk;
  }
}();

console.log(Db); // [LOG]

export * from './schema';
