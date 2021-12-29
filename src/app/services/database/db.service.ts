import { Injectable, Type } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';

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

  public get db(): NgxIndexedDBService {
    return this.dbcore;
  }


}