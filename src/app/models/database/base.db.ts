import { ObjectStoreMeta } from "ngx-indexed-db";
import { ColumnMetadata } from "src/app/decorators/database-column.decorator";

export abstract class StorableModel {

  declare private readonly __columns?: ColumnMetadata[];

  public static getModelDBConfig<T extends StorableModel>(this: new() => T): ObjectStoreMeta {
    const instance = new this();
    return {
      store: this.name.toLowerCase(),
      storeConfig: { keyPath: instance.__columns.find(c => c.primary).key, autoIncrement: false },
      storeSchema: instance.__columns.map(c => ({ name: c.key, keypath: c.key, options: { unique: c.unique } }))
    } 
  }
}

export interface IStorableModelType {
  new(): StorableModel;
  getModelDBConfig(): ObjectStoreMeta;
}