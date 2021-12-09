import { app as electron, BrowserWindow, shell } from "electron";
import { globalShortcut } from "electron/main";
import * as path from "path";
import { checkUpdate, downloadAndInstall } from "./updater";

class App {
  private readonly url = `dist/app/index.html`;
  // private readonly url = `./app/index.html`;
  private window: BrowserWindow;

  public async init(): Promise<void> {
    await new Promise(resolve => electron.on("ready", resolve));
    this.window = new BrowserWindow({
      maximizable: true,
      icon: "../icons/icon.ico",
      titleBarStyle: 'hidden',
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, './preload.js'),
        enableRemoteModule: true,
      }
    });
    this.config();
    // await this.window.loadURL("http://localhost:4200/");
    try {
      await Promise.all([
        this.window.loadFile(this.url),
        this.updateIfNeeded()
      ]);
    } catch (e) {
      console.error(e);
    }
  }

  public config() {
    this.window.webContents.on("will-navigate", (e, url) => {
      if (!url.startsWith("file://"))
        shell.openExternal(url);
    });
    this.window.setMenu(null);
    this.window.menuBarVisible = false;
    this.window.removeMenu();
    this.window.on('closed', () => {
      this.window = null;
    });
    globalShortcut.register("CmdOrCtrl+Shift+I", () => this.window.webContents.openDevTools());
    electron.on('window-all-closed', () => {
      // On macOS it is common for applications to stay open
      // until the user explicitly quits
      if (process.platform !== 'darwin') electron.quit()
    });
  }

  private async updateIfNeeded() {
    const res = await checkUpdate();
    console.log("checkUpdate", res);
    if (res.isUpdateAvailable && res.mandatory) {
      await downloadAndInstall(res.url, (prog) => {
        this.window.setProgressBar(prog >= 1 ? 2 : prog);
      });
    }
  }
}

new App().init();