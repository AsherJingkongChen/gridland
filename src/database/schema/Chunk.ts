import { Db } from '..';

export interface IChunk {
  worldid: number;
  x: number;
  y: number;
};

export class Chunk implements IChunk {
  public static readonly Indexes =
    '[worldid+x+y], ' +
    'createdate, ' +
    'worldid';

  public readonly createdate: Date;
  public readonly worldid: number;
  public readonly x: number;
  public readonly y: number;

  constructor(option: IChunk) {
    this.createdate = new Date();
    this.worldid = option.worldid;
    this.x = option.x;
    this.y = option.y;
  }

  /**
   * Throws `ConstraintError` if the chunk exists
   */
  public static async Create(
      chunk: IChunk
    ): Promise<Chunk> {

    const newChunk = new Chunk(chunk);
    await Db.chunks.add(newChunk);
    return newChunk;
  }

  public static async Read(
      chunk: IChunk
    ): Promise<Chunk | undefined> {

    const { worldid, x, y } = chunk;
    return Db.chunks.get([ worldid, x, y ]);
  }

  public static async Update(
      chunk: Chunk
    ): Promise<Chunk> {

    await Db.chunks.put(chunk);
    return chunk;
  }

  public static async Delete(
      chunk: IChunk
    ): Promise<void> {

    const { worldid, x, y } = chunk;
    await Db.chunks.delete([ worldid, x, y ]);
  }
};
