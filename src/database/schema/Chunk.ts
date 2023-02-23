export interface IChunk {
  worldid: number;
  x: number;
  y: number;
};

export class Chunk implements IChunk {
  public static readonly Indexes =
    '++&id, ' +
    'createdate, ' +
    'worldid, ' +
    '[x+y+worldid]';

  public readonly id!: number;
  public readonly createdate: Date;
  public worldid: number;
  public x: number;
  public y: number;

  constructor(options: IChunk) {
    this.createdate = new Date();
    this.worldid = options.worldid;
    this.x = options.x;
    this.y = options.y;
  }
};
