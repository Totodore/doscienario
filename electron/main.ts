import { app as electron, BrowserWindow, shell } from "electron";
import { globalShortcut } from "electron/main";
import { checkAndUpdate } from "./updater";

class App {
  private readonly url = `dist/app/index.html`;
  // private readonly url = `./app/index.html`;
  private window: BrowserWindow;

  public async init(): Promise<void> {
    checkAndUpdate();
    await new Promise<void>(resolve => electron.on("ready", () => resolve()));
    this.window = new BrowserWindow({
      maximizable: true,
      icon: "../icons/icon.ico",
      titleBarStyle: 'hidden'
    });
    this.config();
    // await this.window.loadURL("http://localhost:4200/");
    await this.window.loadFile(this.url);
  }

  public config() {
    this.window.webContents.on("will-navigate", (e, url) => {
      if (!url.startsWith("file://"))
        shell.openExternal(url);
    });
    this.window.setMenu(null);
    this.window.menuBarVisible = false;
    this.window.on('closed', () => {
      this.window = null;
    });
    globalShortcut.register("CmdOrCtrl+I", () => this.window.webContents.openDevTools());
    electron.on('window-all-closed', () => {
      // On macOS it is common for applications to stay open
      // until the user explicitly quits
      if (process.platform !== 'darwin') electron.quit()
    });
  }
}

new App().init();