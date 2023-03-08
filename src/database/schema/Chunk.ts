import { db } from '..';
import { TilingSprite } from 'pixi.js';

export type ChunkCreateOption = {
  worldid: number;
  x: number;
  y: number;
};

export type ChunkReadOption =
  | {
      id: number;
      worldid?: number;
      x?: number;
      y?: number;
    }
  | {
      id?: number;
      worldid: number;
      x: number;
      y: number;
    };

export class Chunk {
  public static readonly Indexes = '++&id, &[worldid+x+y]';

  public readonly createdate: Date;
  public readonly id!: number;
  public readonly worldid: number;
  public readonly x: number;
  public readonly y: number;

  private constructor(option: ChunkCreateOption) {
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
    const { id, worldid, x, y } = option;
    if (id !== undefined) {
      return db.chunks.get(id);
    } else if (
      worldid !== undefined &&
      x !== undefined &&
      y !== undefined
    ) {
      return db.chunks.get({ worldid, x, y });
    }
    return;
  }

  public static async Update(chunk: Chunk): Promise<Chunk> {
    await db.chunks.put(chunk);
    return chunk;
  }

  public static async Delete(
    option: ChunkReadOption
  ): Promise<void> {
    const { id, worldid, x, y } = option;
    if (id !== undefined) {
      return db.chunks.delete(id);
    } else if (
      worldid !== undefined &&
      x !== undefined &&
      y !== undefined
    ) {
      await db.chunks.where({ worldid, x, y }).delete();
    }
    return;
  }
}

export class ChunkView {
  public readonly data: Chunk;
  public sprite: TilingSprite;

  constructor(option: {
    data: Chunk;
    sprite: TilingSprite;
  }) {
    this.data = option.data;
    this.sprite = option.sprite;
  }
}
