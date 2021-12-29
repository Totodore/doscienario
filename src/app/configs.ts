import { Logs } from './models/api/logs.model';
import { DBConfig } from 'ngx-indexed-db';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Type } from '@angular/core';

export const loggerConfig: INGXLoggerConfig = {
  level: NgxLoggerLevel.INFO,
  disableFileDetails: false,
  timestampFormat: 'dd/MM/YYYY - HH:mm:ss',
};

const dbTables: Type<any>[] = [
  Logs
];

export const dbConfig: DBConfig = {
  name: "doscienario",
  version: 2,
  objectStoresMeta: dbTables.map(table => table.prototype.__dbDefinition),
}