export interface IVec2 {
  x: number;
  y: number;
};

export class Vec2 implements IVec2 {
  public x: number;
  public y: number;

  public get symbol(): symbol {
    return Symbol.for(`Vec2,${this.x},${this.y}`);
  }

  constructor(options?: Partial<IVec2>) {
    this.x = options?.x || 0;
    this.y = options?.y || 0;
  }
};
