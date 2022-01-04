import { Injectable } from '@angular/core';
import Electron from "electron";
import isElectron from 'is-electron';
import { NGXLogger } from 'ngx-logger';
@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private readonly remote: typeof Electron;

  constructor(
    private readonly logger: NGXLogger,
  ) {
    try {
      if (this.isElectronApp) {
        this.remote = window.require("@electron/remote/renderer");
        console.log(this.remote);
      }
    } catch (e) {
      this.logger.error("Could not load electron remote lib", e);
    }
  }

  public get isElectronApp(): boolean {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
      return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to false
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
      return true;
    }

    return false;
  }

  public send(channel: string, ...args: any[]) {
    if (this.isElectronApp && this.remote)
      this.remote.ipcMain.emit(channel, ...args);
  }
}
