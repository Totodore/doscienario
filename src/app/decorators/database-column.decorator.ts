import 'reflect-metadata';

/**
 * Set column metadata in the instance
 */
export function DbColumn() {
  return function (target: any, key: any): void {
    (target.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      unique: false,
      primary: false
    });
  }
}

export function DbPrimaryColumn() {
  return function (target: any, key: any): void {
    (target.__columns ??= []).push({
      key: key,
      type: Reflect.getMetadata("design:type", target, key),
      primary: true,
      unique: true
    });
  }
}

export function DbUniqueColumn() {
  return function (target: any, key: any): void {
    (target.__columns ??= []).push({
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