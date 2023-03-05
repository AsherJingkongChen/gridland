import { IVec2, Vec2, LengthUnit } from '../entity';
import { Container, TilingSprite } from 'pixi.js';
import { Chunk } from '../database';
import { gridLightTexture } from '../resource';

export class Zone extends Container {
  public worldid: number;
  public center: Vec2; // [TODO]

  private _chunks: Map<string, Chunk>;
  private _chunkSprites: Map<string, TilingSprite>;

  constructor(worldid: number) {
    super();

    this.worldid = worldid;

    this.center = new Vec2();
    this._chunks = new Map();
    this._chunkSprites = new Map();
  }

  public override destroy() {
    super.destroy({ children: true });

    (this.center as unknown) = undefined;

    this._chunks.clear();
    (this._chunks as unknown) = undefined;

    this._chunkSprites.clear();
    (this._chunkSprites as unknown) = undefined;

    (this.worldid as unknown) = undefined;
  }

  public getChunks(): Map<string, Chunk> {
    return this._chunks;
  }

  public getChunk(key: string): Chunk | undefined;
  public getChunk(pos: IVec2): Chunk | undefined;
  public getChunk(
    keyOrPos: string | IVec2
  ): Chunk | undefined {
    if (typeof keyOrPos === 'string') {
      return this._chunks.get(keyOrPos);
    } else {
      return this._chunks.get(Vec2.Key(keyOrPos));
    }
  }

  public setChunk(chunk: Chunk) {
    const key = Vec2.Key(chunk);
    this._chunks.set(key, chunk);

    if (!this._chunkSprites.has(key)) {
      const chunkSprite = TilingSprite.from(
        gridLightTexture,
        {
          width: LengthUnit.PixelPerChunk,
          height: LengthUnit.PixelPerChunk
        }
      );

      chunkSprite.position.set(
        chunk.x * LengthUnit.PixelPerChunk,
        chunk.y * LengthUnit.PixelPerChunk
      );

      this._chunkSprites.set(
        key,
        this.addChild(chunkSprite)
      );
    }
  }

  public deleteChunk(chunk: Chunk): boolean {
    const key = Vec2.Key(chunk);
    const exist = this._chunks.delete(key);

    if (exist) {
      this.removeChild(
        this._chunkSprites.get(key) as TilingSprite
      );
      this._chunkSprites.delete(key);
    }
    return exist;
  }
}
