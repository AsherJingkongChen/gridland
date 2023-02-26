import {
  Vec2
} from '../entity';
import {
  Container
} from 'pixi.js';
import {
  Chunk,
  World
} from '../database';

export class Zone extends Container {
  public chunks: Map<symbol, Chunk>;
  public world: World;
  public _center: Vec2; // [TODO]

  constructor(world: World) {
    super();

    this.chunks = new Map();
    this.world = world;
    this._center = new Vec2();
  }
};
