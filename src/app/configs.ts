import { Type } from '@angular/core';
import { DBConfig } from 'ngx-indexed-db';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Logs } from './models/api/logs.model';
import { Tab } from './models/sys/tab.model';

export const loggerConfig: INGXLoggerConfig = {
  level: NgxLoggerLevel.INFO,
  disableFileDetails: false,
  timestampFormat: 'dd/MM/YYYY - HH:mm:ss',
};

const dbTables: Type<any>[] = [
  Logs,
  Tab
];

export const dbConfig: DBConfig = {
  name: "doscienario",
  version: 3,
  objectStoresMeta: dbTables.map(table => table.prototype.__dbDefinition),
}