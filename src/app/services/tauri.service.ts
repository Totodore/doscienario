import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
@Injectable({
  providedIn: 'root'
})
export class TauriService {

  constructor() { }

  public closeSplashscreen() {
    invoke('close_splashscreen');
  }
}
