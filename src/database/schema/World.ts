import { ISchema } from './ISchema';

export interface IWorld {
  chunkcount: number;
  name: string;
};

export class World implements IWorld, ISchema {
  public static readonly Indexes =
    '++&id, ' +
    'createdate, ' +
    'name, ' +
    'chunkcount';

  public readonly id!: number;
  public readonly createdate: Date;
  public chunkcount: number;
  public name: string;

  constructor(options: IWorld) {
    this.createdate = new Date();
    this.chunkcount = 0;
    this.name = options.name;
  }
};
