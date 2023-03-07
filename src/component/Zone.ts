import { IVec2, Vec2 } from '../entity';
import {
  Container,
  IDestroyOptions,
  Texture,
  TilingSprite
} from 'pixi.js';
import { Chunk } from '../database';
import { Destroyable } from '../design/Destroyable';

export class Zone extends Container implements Destroyable {
  public center: Vec2; // [TODO]
  public readonly chunks: Map<string, Chunk>;
  public readonly chunkPerZone: number;
  public readonly gridPerChunk: number;
  public readonly gridTexture: Texture; // [TODO]
  public readonly pixelPerGridHorizontal: number;
  public readonly pixelPerGridVertical: number;
  public readonly worldid: number;

  private _chunkSprites: Map<string, TilingSprite>;

  constructor(option: {
    chunkPerZone: number;
    gridPerChunk: number;
    gridTexture: Texture;
    worldid: number;
  }) {
    super();

    this._chunkSprites = new Map();

    this.center = new Vec2();
    this.chunks = new Map();
    this.chunkPerZone = option.chunkPerZone;
    this.gridPerChunk = option.gridPerChunk;
    this.pixelPerGridHorizontal = 32;
    this.pixelPerGridVertical = 32; // [TODO]
    this.gridTexture = option.gridTexture;
    this.worldid = option.worldid;
  }

  public override destroy(
    options?: IDestroyOptions | boolean
  ): void {
    if (!this.destroyed) {
      super.destroy(options ?? { children: true });

      this._chunkSprites.clear();
      (this._chunkSprites as unknown) = undefined;

      (this.center as unknown) = undefined;
      this.chunks.clear();
      (this.chunks as unknown) = undefined;
      (this.chunkPerZone as unknown) = undefined;
      (this.gridPerChunk as unknown) = undefined;
      (this.pixelPerGridHorizontal as unknown) = undefined;
      (this.pixelPerGridVertical as unknown) = undefined;
      (this.gridTexture as unknown) = undefined;
      (this.worldid as unknown) = undefined;
    }
  }

  public getChunk(key: string): Chunk | undefined;
  public getChunk(pos: IVec2): Chunk | undefined;
  public getChunk(
    keyOrPos: string | IVec2
  ): Chunk | undefined {
    if (typeof keyOrPos === 'string') {
      return this.chunks.get(keyOrPos);
    } else {
      return this.chunks.get(Vec2.Key(keyOrPos));
    }
  }

  public setChunk(chunk: Chunk) {
    const key = Vec2.Key(chunk);
    this.chunks.set(key, chunk);

    if (!this._chunkSprites.has(key)) {
      const chunkSprite = new TilingSprite(
        this.gridTexture,
        this.pixelPerGridHorizontal * this.gridPerChunk,
        this.pixelPerGridVertical * this.gridPerChunk
      );

      chunkSprite.position.set(
        chunk.x * chunkSprite.width,
        chunk.y * chunkSprite.height
      );

      this._chunkSprites.set(
        key,
        this.addChild(chunkSprite)
      );
    }
  }

  public deleteChunk(chunk: Chunk): boolean {
    const key = Vec2.Key(chunk);
    const exist = this.chunks.delete(key);

    if (exist) {
      this.removeChild(
        this._chunkSprites.get(key) as TilingSprite
      );
      this._chunkSprites.delete(key);
    }
    return exist;
  }
}
