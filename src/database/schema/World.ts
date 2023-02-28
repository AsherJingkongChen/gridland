export interface IWorld {
  name: string;
};

export class World implements IWorld {
  public static readonly Indexes =
    '++&id, ' +
    'chunkcount, ' +
    'createdate, ' +
    'name';

  public readonly id!: number;
  public chunkcount: number;
  public readonly createdate: Date;
  public name: string;

  constructor(option: IWorld) {
    this.chunkcount = 0;
    this.createdate = new Date();
    this.name = option.name;
  }
};
