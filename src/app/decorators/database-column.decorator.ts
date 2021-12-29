import 'reflect-metadata';


export function DbTable() {
  return function (constructor: Function): void {
    constructor.prototype.__tableName = constructor.name.toLowerCase();
    constructor.prototype.__dbDefinition = {
      store: constructor.prototype.__tableName,
      storeConfig: { keyPath: constructor.prototype.__columns.find(c => c.primary).key, autoIncrement: false },
      storeSchema: constructor.prototype.__columns.map(c => ({ name: c.key, keypath: c.key, options: { unique: c.unique } }))
    };
  }
}
/**
 * Set column metadata in the instance
 */
export function DbColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      unique: false,
      primary: false
    });
  }
}

export function DbPrimaryColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      primary: true,
      unique: true
    });
  }
}

export function DbUniqueColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      unique: true,
      primary: false
    });
  }
}

export type ColumnMetadata = {
  key: string;
  type: string;
  unique: boolean;
  primary: boolean;
}