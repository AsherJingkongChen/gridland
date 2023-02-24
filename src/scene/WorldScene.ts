import {
  Vec2
} from '../type/Vec2';
import {
  Container
} from 'pixi.js';
import {
  Chunk,
  World
} from '../database';

export class WorldScene extends Container {
  public view: World;
  public chunks: Map<symbol, Chunk>;
  public _center: Vec2; // [TODO]

  constructor(view: World) {
    super();

    this.view = view;
    this.chunks = new Map();
    this._center = new Vec2();
  }
};
