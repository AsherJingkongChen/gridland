export type Vec2CreateOption = {
  x?: number;
  y?: number;
};

export class Vec2 {
  public x: number;
  public y: number;

  public get key(): string {
    return Vec2.Key(this);
  }

  constructor(option?: Vec2CreateOption) {
    this.x = option?.x ?? 0;
    this.y = option?.y ?? 0;
  }

  public static Key(option?: Vec2CreateOption): string {
    return `Vec2,${option?.x ?? 0},${option?.y ?? 0}`;
  }
}
