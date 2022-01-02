import { Injectable, Type } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';


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
    return this.db.add(table.prototype.__tableName, value as T, key).toPromise();
  }

  public clear<T>(table: Type<T>) {
    return this.db.clear(table.prototype.__tableName).toPromise();
  }

  public remove<T>(table: Type<T>, key: string | T) {
    return this.db.delete(table.prototype.__tableName, typeof key === "string" ? key : key[table.prototype.__dbDefinition.storeConfig.keyPath]).toPromise();
  }
  public removeMany<T>(table: Type<T>, obj: T[]) {
    return this.db.bulkDelete(table.prototype.__tableName, obj.map(el => el[table.prototype.__dbDefinition.storeConfig.keyPath])).toPromise();
  }
  public async getManyWhere<T>(table: Type<T>, key: keyof T, val: IDBKeyRange | string | number, select?: (keyof T)[]): Promise<T[]> {
    const res = await this.db.getAllByIndex<T>(table.prototype.__tableName, key as string, typeof val != "object" ? IDBKeyRange.only(val) : val).toPromise();
    if (select)
      return res.map(x => select.reduce<Partial<T>>((acc, key) => ({ ...acc, [key]: x[key] }), {})) as T[];
    else
      return res;
  }

  public async getAll<T>(table: Type<T>, select?: (keyof T)[]) {
    const res = await this.db.getAll<T>(table.prototype.__tableName).toPromise();
    if (select)
      return res.map(x => select.reduce<Partial<T>>((acc, key) => ({ ...acc, [key]: x[key] }), {}));
    else
      return res;
  }

  public get db(): NgxIndexedDBService {
    return this.dbcore;
  }


}