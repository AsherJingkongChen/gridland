import {
  Table,
  Dexie,
  PromiseExtended
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

    public createChunk(
        options: IChunk
      ): PromiseExtended<Chunk> {

      const { worldid, x, y } = options;

      return (
        this.chunks
          .get({ worldid, x, y })
          .then(async (chunk) => {
            if (! chunk) {
              chunk = new Chunk(options);
              await this.chunks.add(chunk);
            }
            return chunk;
          })
      );
    }

    public readChunk(
        idOrOptions: number | IChunk
      ): PromiseExtended<Chunk | undefined> {

      if (typeof idOrOptions === 'number') {
        return this.chunks.get(idOrOptions);

      } else {
        const { worldid, x, y } = idOrOptions;
        return this.chunks.get({ worldid, x, y });
      }
    }

    public updateChunk(
        chunk: Chunk
      ): PromiseExtended<Chunk> {

      return (
        this.chunks
          .put(chunk)
          .then(() => chunk)
      );
    }

    public deleteChunk(
        idOrOptions: number | IChunk
      ): PromiseExtended<Chunk | undefined> {

      return (
        this
          .readChunk(idOrOptions)
          .then(async (chunk) => {
            if (chunk) {
              await this.chunks.delete(chunk.id);
            }
            return chunk;
          })
      );
    }
  }();

console.log(Db); // [LOG]

export * from './schema';
