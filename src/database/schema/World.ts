import { db } from '..';

export type WorldCreateOption = {
  name: string;
};

export type WorldReadOption =
  | {
      id?: number;
      name: string;
    }
  | {
      id: number;
      name?: string;
    };

export class World {
  public static readonly Indexes = '++&id,' + 'name';

  public readonly createdate: Date;
  public readonly id!: number;
  public name: string;

  constructor(option: WorldCreateOption) {
    this.createdate = new Date();
    this.name = option.name;
  }

  /**
   * Throws `ConstraintError` by Dexie if exists
   */
  public static async Create(
    option: WorldCreateOption
  ): Promise<World> {
    const newWorld = new World(option);
    await db.worlds.add(newWorld);
    return newWorld;
  }

  public static async Read(
    option: WorldReadOption
  ): Promise<World | World[] | undefined> {
    const { id, name } = option;
    if (id !== undefined) {
      return db.worlds.get(id);
    } else if (name !== undefined) {
      return db.worlds.where({ name }).toArray();
    }
    return;
  }

  public static async Update(world: World): Promise<World> {
    await db.worlds.put(world);
    return world;
  }

  public static async Delete(
    option: WorldReadOption
  ): Promise<void> {
    const { id, name } = option;
    if (id !== undefined) {
      return db.worlds.delete(id);
    } else if (name !== undefined) {
      await db.worlds.where({ name }).delete();
    }
  }
}
