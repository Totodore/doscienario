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
    return isElectron();
  }

  public send(channel: string, ...args: any[]) {
    if (this.isElectronApp && this.remote)
      this.remote.ipcMain.emit(channel, ...args);
  }
}
