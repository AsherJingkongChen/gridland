import { db } from '..';

export interface IChunk {
  worldid: number;
  x: number;
  y: number;
}

export interface OChunk {
  worldid: number;
  x: number;
  y: number;
}

export class Chunk implements IChunk {
  public static readonly Indexes =
    '[worldid+x+y], ' + 'createdate, ' + 'worldid';

  public readonly createdate: Date;
  public readonly worldid: number;
  public readonly x: number;
  public readonly y: number;

  constructor(option: OChunk) {
    this.createdate = new Date();
    this.worldid = option.worldid;
    this.x = option.x;
    this.y = option.y;
  }

  /**
   * Throws `ConstraintError` if the chunk exists
   */
  public static async Create(
    chunk: OChunk
  ): Promise<Chunk> {
    const newChunk = new Chunk(chunk);
    await db.chunks.add(newChunk);
    return newChunk;
  }

  public static async Read({
    worldid,
    x,
    y
  }: OChunk): Promise<Chunk | undefined> {
    return db.chunks.get([worldid, x, y]);
  }

  public static async Update(chunk: Chunk): Promise<Chunk> {
    await db.chunks.put(chunk);
    return chunk;
  }

  public static async Delete({
    worldid,
    x,
    y
  }: OChunk): Promise<void> {
    await db.chunks.delete([worldid, x, y]);
  }
}
