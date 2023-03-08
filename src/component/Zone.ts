import {
  createOptionalSignal,
  createSignal
} from '../entity';
import { Texture } from 'pixi.js';
import { ChunkView, World } from '../database';

export const createZone = (option: {
  chunkPerZone?: number;
  gridPerChunk?: number;
  gridTexture?: Texture; // [TODO] Can it be optional?
  world: World;
}) => {
  const [chunks] = createSignal(
    new Map<number, ChunkView>()
  );

  const [chunkPerZone, setChunkPerZone] = createSignal(
    option.chunkPerZone ?? 8
  );

  const [gridPerChunk, setGridPerChunk] = createSignal(
    option.gridPerChunk ?? 64
  );

  const [gridTexture, setGridTexture] =
    createOptionalSignal(option.gridTexture);

  const [world, setWorld] = createSignal(option.world);

  return {
    chunks,
    chunkPerZone,
    gridPerChunk,
    gridTexture,
    world,

    setChunkPerZone,
    setGridPerChunk,
    setGridTexture,
    setWorld
  };
};

// export class Zone extends Container {
//   public readonly chunks: Accessor<Map<string, Chunk>>;
//   public readonly setChunks: Setter<Map<string, Chunk>>;

//   public readonly chunkPerZone: Accessor<number>;
//   public readonly setChunkPerZone: Setter<number>;

//   public readonly gridPerChunk: Accessor<number>;
//   public readonly setGridPerChunk: Setter<number>;

//   public readonly gridTexture: OptionalAccessor<Texture>;
//   public readonly setGridTexture: OptionalSetter<Texture>;

//   public readonly world: OptionalAccessor<World>;
//   public readonly setWorld: OptionalSetter<World>;

//   private _chunkSprites: Map<string, TilingSprite>;

//   constructor(option: {
//     chunkPerZone?: number;
//     gridPerChunk?: number;
//     gridTexture?: Texture;
//     world: World;
//   }) {
//     super();

//     [this.chunks, this.setChunks] =
//       createSignal(new Map());

//     [this.chunkPerZone, this.setChunkPerZone] =
//       createSignal(option.chunkPerZone ?? 8);

//     [this.gridPerChunk, this.setGridPerChunk] =
//       createSignal(option.gridPerChunk ?? 64);

//     [this.gridTexture, this.setGridTexture] =
//       createOptionalSignal(
//         option.gridTexture ?? new Texture(new BaseTexture())
//       );

//     [this.world, this.setWorld] =
//       createOptionalSignal(option.world);

//     this._chunkSprites = new Map();
//   }

//   public override destroy(): void {
//     if (this.destroyed) {
//       return;
//     }

//     super.destroy({ children: true });

//     this.chunks().forEach((chunk) => {
//       chunk.save();
//     });
//     this.chunks().clear();

//     this.setChunkPerZone(1);

//     this.setGridPerChunk(1);

//     this.setGridTexture(undefined);

//     this.world()?.save();
//     this.setWorld(undefined);

//     this._chunkSprites.clear();
//   }

//   public getChunk(key: string): Chunk | undefined;
//   public getChunk(pos: IVec2): Chunk | undefined;
//   public getChunk(
//     keyOrPos: string | IVec2
//   ): Chunk | undefined {
//     if (typeof keyOrPos === 'string') {
//       return this.chunks().get(keyOrPos);
//     } else {
//       return this.chunks().get(Vec2.Key(keyOrPos));
//     }
//   }

//   public setChunk(chunk: Chunk) {
//     const key = Vec2.Key(chunk);
//     this.chunks().set(key, chunk);

//     if (
//       this._chunkSprites.has(key) ||
//       this.gridTexture() === undefined
//     ) {
//       return;
//     }

//     const chunkSprite = new TilingSprite(
//       this.gridTexture()!,
//       32 * this.gridPerChunk(),
//       32 * this.gridPerChunk()
//     );

//     chunkSprite.position.set(
//       chunk.x * chunkSprite.width,
//       chunk.y * chunkSprite.height
//     );

//     this._chunkSprites.set(
//       key,
//       this.addChild(chunkSprite)
//     );
//   }

//   public deleteChunk(chunk: Chunk): boolean {
//     const key = Vec2.Key(chunk);
//     const exist = this.chunks().delete(key);

//     if (exist) {
//       this.removeChild(
//         this._chunkSprites.get(key) as TilingSprite
//       );
//       this._chunkSprites.delete(key);
//     }
//     return exist;
//   }
// }
