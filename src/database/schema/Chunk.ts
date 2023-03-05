import { db } from '..';

export type ChunkCreateOption = {
  worldid: number;
  x: number;
  y: number;
};

export type ChunkReadOption = {
  worldid: number;
  x: number;
  y: number;
};

export class Chunk {
  public static readonly Indexes = '[worldid+x+y]';

  public readonly createdate: Date;
  public readonly worldid: number;
  public readonly x: number;
  public readonly y: number;

  constructor(option: ChunkCreateOption) {
    this.createdate = new Date();
    this.worldid = option.worldid;
    this.x = option.x;
    this.y = option.y;
  }

  /**
   * Throws `ConstraintError` by Dexie if exists
   */
  public static async Create(
    option: ChunkCreateOption
  ): Promise<Chunk> {
    const newChunk = new Chunk(option);
    await db.chunks.add(newChunk);
    return newChunk;
  }

  public static async Read(
    option: ChunkReadOption
  ): Promise<Chunk | undefined> {
    return db.chunks.get([
      option.worldid,
      option.x,
      option.y
    ]);
  }

  public static async Update(chunk: Chunk): Promise<Chunk> {
    await db.chunks.put(chunk);
    return chunk;
  }

  public static async Delete(
    option: ChunkReadOption
  ): Promise<void> {
    return db.chunks.delete([
      option.worldid,
      option.x,
      option.y
    ]);
  }
}
