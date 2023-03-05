export interface IVec2 {
  x: number;
  y: number;
}

export class Vec2 implements IVec2 {
  public x: number;
  public y: number;

  public get key(): string {
    return Vec2.Key(this);
  }

  constructor(option?: Partial<IVec2>) {
    this.x = option?.x ?? 0;
    this.y = option?.y ?? 0;
  }

  public static Key(option?: Partial<IVec2>): string {
    return `Vec2,${option?.x ?? 0},${option?.y ?? 0}`;
  }
}
