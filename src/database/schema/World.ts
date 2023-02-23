export interface IWorld {
  readonly id: number;
  readonly createdate: Date;
  name: string;
};

export interface WorldOption {
  name: string;
};

export class World implements IWorld {
  public static readonly Indexes =
    '++&id, ' +
    'createdate, ' +
    'name';

  public readonly id!: number;
  public readonly createdate: Date;
  public name: string;

  constructor(options: WorldOption) {
    this.createdate = new Date();
    this.name = options.name;
  }
};
