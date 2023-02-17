import { Injectable, Type } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { lastValueFrom } from "rxjs";

/**
 * @class Wrapper service for ngx-indexed-db
 * Provide orm functions
 */
@Injectable({ providedIn: 'root' })
export class DbService {
  
  constructor(
    private readonly dbcore: NgxIndexedDBService
  ) { }

  public add<T>(table: Type<T>, value: Partial<T>, key?: string): Promise<T> {
    return lastValueFrom(this.db.add(table.prototype.__tableName, value as T, key));
  }

  public clear<T>(table: Type<T>) {
    return lastValueFrom(this.db.clear(table.prototype.__tableName));
  }

  public remove<T>(table: Type<T>, key: string | T) {
    return lastValueFrom(this.db.delete(table.prototype.__tableName, typeof key === "string" ? key : key[table.prototype.__dbDefinition.storeConfig.keyPath]));
  }
  public removeMany<T>(table: Type<T>, obj: T[]) {
    return lastValueFrom(this.db.bulkDelete(table.prototype.__tableName, obj.map(el => el[table.prototype.__dbDefinition.storeConfig.keyPath])));
  }
  public async getManyWhere<T>(table: Type<T>, key: keyof T, val: IDBKeyRange | string | number, select?: (keyof T)[]): Promise<T[]> {
    const res = await lastValueFrom(this.db.getAllByIndex<T>(table.prototype.__tableName, key as string, typeof val != "object" ? IDBKeyRange.only(val) : val));
    if (select)
      return res.map(x => select.reduce<Partial<T>>((acc, key) => ({ ...acc, [key]: x[key] }), {})) as T[];
    else
      return res;
  }

  public async getAll<T>(table: Type<T>, select?: (keyof T)[]) {
    const res = await lastValueFrom(this.db.getAll<T>(table.prototype.__tableName));
    if (select)
      return res.map(x => select.reduce<Partial<T>>((acc, key) => ({ ...acc, [key]: x[key] }), {}));
    else
      return res;
  }

  public get db(): NgxIndexedDBService {
    return this.dbcore;
  }


}