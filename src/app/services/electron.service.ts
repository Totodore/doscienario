import { Injectable } from '@angular/core';
import Electron from "electron";
@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private lib: typeof Electron;

  constructor() { 
    try {
      this.lib = window.require('@electron/remote');
    } catch(e) {}
  }

  public get isElectronApp(): boolean {
    return this.lib !== undefined;
  }

  public send(channel: string, ...args: any[]) {
    if (this.isElectronApp)
      this.lib.ipcRenderer.send(channel, args);
  }
}
