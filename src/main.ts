import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

String.prototype.insert = function(index: number, what: string) {
  return index > 0
      ? this.replace(new RegExp('.{' + index + '}'), '$&' + what)
      : what + this;
};
String.prototype.delete = function(from: number, length: number = 1) {
  return this.substring(0, from) + this.substring(from + length, this.length);
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
