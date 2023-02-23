import {
  Container
} from 'pixi.js';
import {
  Chunk,
  World,
  HasXY
} from '../database';

export class WorldScene extends Container {
  public chunks: Map<HasXY, Chunk>;
  public world: World;
  public _center: HasXY; //

  constructor(world: World) {
    super();

    this.chunks = new Map();
    this.world = world;
    this._center = { x: 0, y: 0 };
  }
};
