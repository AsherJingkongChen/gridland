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

    public async createChunk(
        options: IChunk
      ): Promise<Chunk> {

      const { worldid, x, y } = options;
      let chunk = await
        this.chunks.get({ worldid, x, y });

      if (! chunk) {
        chunk = new Chunk(options);
        await this.chunks.add(chunk);
      }
      return chunk;
    }

    public async readChunk(
        idOrOptions: number | IChunk
      ): Promise<Chunk | undefined> {

      let chunk: Chunk | undefined;

      if (typeof idOrOptions === 'number') {
        chunk = await
          this.chunks.get(idOrOptions);

      } else {
        const { worldid, x, y } = idOrOptions;
        chunk = await
          this.chunks.get({ worldid, x, y });
      }

      return chunk;
    }

    public async updateChunk(chunk: Chunk) {
      await this.chunks.put(chunk);
    }

    public async deleteChunk(
        idOrOptions: number | IChunk
      ) {

      const chunk = await
        this.readChunk(idOrOptions);
      if (chunk) {
        await this.chunks.delete(chunk.id);
      }
    }
  }();

console.log(Db); // [LOG]

export * from './schema';
