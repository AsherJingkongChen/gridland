export interface WorldIndex {
  readonly id?: number;
  readonly createdate: Date;
  name: string;
};

export interface WorldData {
};

export type IWorld = WorldIndex & WorldData;

export class World implements IWorld {
  public readonly id?: number;
  public readonly createdate: Date;
  public name: string;

  constructor(
      options?: {
        name?: string
      }
    ) {

    this.createdate = new Date();
    this.name = options?.name || 'Anonymous';
  }
};
