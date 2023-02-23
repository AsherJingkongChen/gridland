export interface IWorld {
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

  constructor(options: IWorld) {
    this.createdate = new Date();
    this.name = options.name;
  }
};
