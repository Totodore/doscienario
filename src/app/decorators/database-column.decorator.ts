import 'reflect-metadata';


export function DbTable() {
  return function (constructor: Function): void {
    constructor.prototype.__tableName = constructor.name.toLowerCase();
    const keyColumn = constructor.prototype.__columns.find(c => c.primary);
    constructor.prototype.__dbDefinition = {
      store: constructor.prototype.__tableName,
      storeConfig: { keyPath: keyColumn.key, autoIncrement: keyColumn.generated },
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
      primary: false,
      generated: false,
    });
  }
}


export function DbPrimaryGeneratedColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      primary: true,
      unique: true,
      generated: true,
    });
  }
}

export function DbPrimaryColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      primary: true,
      unique: true,
      generated: false,
    });
  }
}

export function DbUniqueColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      unique: true,
      primary: false,
      generated: false,
    });
  }
}

export type ColumnMetadata = {
  key: string;
  type: string;
  unique: boolean;
  primary: boolean;
  generated: boolean;
}