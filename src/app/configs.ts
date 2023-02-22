import { Type } from '@angular/core';
import { grpc } from '@improbable-eng/grpc-web';
import { ImprobableEngGrpcWebClientRootOptions } from '@ngx-grpc/improbable-eng-grpc-web-client/public-api';
import { DBConfig } from 'ngx-indexed-db';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { Logs } from './models/api/logs.model';
import { KeyStore } from './models/sys/keystore.model';
import { Tab } from './models/sys/tab.model';

export const loggerConfig: INGXLoggerConfig = {
  level: NgxLoggerLevel.DEBUG,
  disableFileDetails: false,
  timestampFormat: 'dd/MM/YYYY - HH:mm:ss',
};

const dbTables: Type<any>[] = [
  Logs,
  Tab,
  KeyStore
];

export const dbConfig: DBConfig = {
  name: "doscienario",
  version: 7,
  objectStoresMeta: dbTables.map(table => table.prototype.__dbDefinition),
}

const fetchConf = grpc.FetchReadableStreamTransport({});

export const grpcConfig: ImprobableEngGrpcWebClientRootOptions = {
  settings: {
    host: environment.grpcUrl,
    transport: fetchConf,
    debug: !environment.production
  }
}