import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import packageVersion from '../package.json';

console.log(environment.production ? 'Production Mode, version: ' + packageVersion.version : 'Development Mode, version: ' + packageVersion.version);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
