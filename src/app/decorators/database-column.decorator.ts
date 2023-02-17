import 'reflect-metadata';


/**
 * Create a ngx-indexed-db definition for the given entity table 
 */
export function DbTable() {
  return function (constructor: Function): void {
    constructor.prototype.__tableName = camelToSnakeCase(constructor.name);
    const keyColumn = constructor.prototype.__columns.find(c => c.primary);
    constructor.prototype.__dbDefinition = {
      store: constructor.prototype.__tableName,
      storeConfig: { keyPath: keyColumn.key, autoIncrement: keyColumn.generated },
      storeSchema: constructor.prototype.__columns.map(c => ({ name: c.key, keypath: c.key, options: { unique: c.unique } }))
    };
  }
}
/**
 * Decorator for database columns
 * Set column metadata in the prototype
 */
export function DbColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: camelToSnakeCase(key),
      type: Reflect.getMetadata("design:type", target, key),
      unique: false,
      primary: false,
      generated: false,
    });
  }
}

/**
 * Decorator for database columns
 * Set column metadata in the prototype
 */
export function DbPrimaryGeneratedColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: camelToSnakeCase(key),
      type: Reflect.getMetadata("design:type", target, key),
      primary: true,
      unique: true,
      generated: true,
    });
  }
}

/**
 * Decorator for database columns
 * Set column metadata in the prototype
 */
export function DbPrimaryColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: camelToSnakeCase(key),
      type: Reflect.getMetadata("design:type", target, key),
      primary: true,
      unique: true,
      generated: false,
    });
  }
}

/**
 * Decorator for database columns
 * 
 */
export function DbUniqueColumn() {
  return function (target: any, key: any): void {
    (target.constructor.prototype.__columns ??= []).push({
      key: camelToSnakeCase(key),
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

function camelToSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`);
}