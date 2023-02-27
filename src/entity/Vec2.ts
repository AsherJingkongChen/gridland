export interface IVec2 {
  x: number;
  y: number;
};

export class Vec2 implements IVec2 {
  public x: number;
  public y: number;

  public get key(): symbol {
    return Vec2.Key(this);
  }

  constructor(options?: Partial<IVec2>) {
    this.x = options?.x || 0;
    this.y = options?.y || 0;
  }

  public static Key(options?: Partial<IVec2>): symbol {
    return (
      Symbol
      .for(`Vec2,${options?.x || 0},${options?.y || 0}`)
    );
  }
};

export type Vec2Symbol = symbol;
