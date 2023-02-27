import { Db } from '..';
import { ISchema } from './ISchema';

export interface IChunk {
  worldid: number;
  x: number;
  y: number;
};

export class Chunk implements IChunk, ISchema {
  public static readonly Indexes =
    '++&id, ' +
    'createdate, ' +
    'worldid, ' +
    '[worldid+x+y]';

  public readonly id!: number;
  public readonly createdate: Date;
  public worldid: number;
  public x: number;
  public y: number;

  constructor(options: IChunk) {
    this.createdate = new Date();
    this.worldid = options.worldid;
    this.x = options.x;
    this.y = options.y;
  }

  public static async Get(
      options: IChunk
    ): Promise<Chunk> {

    const oldChunk = await this.Read(options);
    if (oldChunk) { return oldChunk; }

    const newChunk = new Chunk(options);
    await Db.chunks.add(newChunk);

    return newChunk;
  }

  public static async Read(
      idOrOptions: number | IChunk
    ): Promise<Chunk | undefined> {

    if (typeof idOrOptions === 'number') {
      return Db.chunks.get(idOrOptions);

    } else {
      const { worldid, x, y } = idOrOptions;
      return Db.chunks.get({ worldid, x, y });
    }
  }

  public static async Update(
      chunk: Chunk
    ): Promise<Chunk> {

    await Db.chunks.put(chunk);
    return chunk;
  }

  public static async Delete(
      idOrOptions: number | IChunk
    ): Promise<Chunk | undefined> {

    const chunk = await this.Read(idOrOptions);
    if (! chunk) { return; }

    await Db.chunks.delete(chunk.id);
    return chunk;
  }
};
