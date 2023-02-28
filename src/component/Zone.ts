import {
  IVec2,
  Vec2,
  Vec2Symbol,
  PixelPerChunk,
} from '../entity';
import {
  Container,
  TilingSprite,
} from 'pixi.js';
import {
  Chunk,
  World,
} from '../database';
import {
  gridLightTexture,
} from '../resource';

export class Zone extends Container {
  public world: World;

  private _center: Vec2; // [TODO]
  private _chunks: Map<Vec2Symbol, Chunk>;
  private _chunkSprites: Map<Vec2Symbol, TilingSprite>;

  constructor(world: World) {
    super();

    this.world = world;

    this._center = new Vec2();
    this._chunks = new Map();
    this._chunkSprites = new Map();
  }

  public override destroy() {
    super.destroy({ children: true });

    (this._center as any) = undefined;

    this._chunks.clear();
    (this._chunks as any) = undefined;

    this._chunkSprites.clear();
    (this._chunkSprites as any) = undefined;

    (this.world as any) = undefined;
  }

  /**
   * Move center in chunk coordinates system
   * 
   * @returns true if the center moves
   */
  public recenter(center: IVec2): boolean {
    if (center.x === this._center.x &&
        center.y === this._center.y) {

      return false;
    }

    this._center.x = center.x;
    this._center.y = center.y;
    return true;
  }

  public getChunks(): Map<Vec2Symbol, Chunk> {
    return this._chunks;
  }

  public getChunk(
      keyOrPos: Vec2Symbol | IVec2
    ): Chunk | undefined {

    if (typeof keyOrPos === 'symbol') {
      return this._chunks.get(keyOrPos);

    } else {
      return this._chunks.get(Vec2.Key(keyOrPos));
    }
  }

  public setChunk(chunk: Chunk) {
    const key = Vec2.Key(chunk);
    this._chunks.set(key, chunk);

    if (! this._chunkSprites.has(key)) {
      const chunkSprite =
        TilingSprite.from(
          gridLightTexture,
          {
            width: PixelPerChunk,
            height: PixelPerChunk,
          }
        );

      chunkSprite.position.set(
        chunk.x * PixelPerChunk,
        chunk.y * PixelPerChunk
      );

      this._chunkSprites.set(
        key,
        this.addChild(chunkSprite)
      );
    }
  }

  public deleteChunk(chunk: Chunk): boolean {
    const key = Vec2.Key(chunk);

    if (this._chunks.delete(key)) {
      this.removeChild(
        this._chunkSprites.get(key)!
      );
      return this._chunkSprites.delete(key);

    } else {
      return false;
    }
  }

  public getChunkSprite(
      keyOrPos: Vec2Symbol | IVec2
    ): TilingSprite | undefined {

    if (typeof keyOrPos === 'symbol') {
      return this._chunkSprites.get(keyOrPos);

    } else {
      return this._chunkSprites.get(Vec2.Key(keyOrPos));
    }
  }
};
