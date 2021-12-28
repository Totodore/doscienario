import { Logs } from './models/database/logs.db';
import { Type } from '@angular/core';
import { DBConfig } from 'ngx-indexed-db';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { IStorableModelType, StorableModel } from './models/database/base.db';

export const loggerConfig: INGXLoggerConfig = {
  level: NgxLoggerLevel.INFO,
  disableFileDetails: false,
  timestampFormat: 'dd/MM/YYYY - HH:mm:ss',
};

const dbTables: IStorableModelType[] = [
  Logs
];

export const dbConfig: DBConfig = {
  name: "doscienario",
  version: 1,
  objectStoresMeta: dbTables.map(table => table.getModelDBConfig()),
}