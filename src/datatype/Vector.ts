export interface IVector {
  x: number;
  y: number;
  z?: number;
};

export class Vector implements IVector {
  public x: number;
  public y: number;
  public z?: number;

  constructor(
      options?: {
        x?: number,
        y?: number,
        z?: number
      }
    ) {

    this.x = options?.x || 0;
    this.y = options?.y || 0;
    this.z = options?.z;
  }
};
