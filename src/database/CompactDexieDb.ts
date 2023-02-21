import { Dexie } from 'dexie';

export class CompactDexieDb extends Dexie {
  /**
   * @param options.database
   * The name of database
   * 
   * @param options.version
   * The version of database
   * 
   * @param options.schemas
   * The schemas of database
   */
  constructor(
      options: {
        database: string,
        version: number,
        schemas: {
          type: Function,
          index: string | null
        }[]
      }
    ) {

    super(options.database);

    const vers = this.version(options.version);

    for (const {type, index} of options.schemas) {
      vers.stores(Object.fromEntries([ [type.name, index] ]));
      this.table(type.name).mapToClass(type);
    }
  }
};
