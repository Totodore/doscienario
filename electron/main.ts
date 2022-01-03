import { app as electron, BrowserWindow, ipcMain, shell } from "electron";
import { globalShortcut } from "electron/main";
import { checkUpdate, downloadAndInstall } from "./updater";
import { join } from "path";

//Initializing remote module for electron-remote
require("@electron/remote/main").initialize();

class App {
  private readonly url = `./app/index.html`;
  private window: BrowserWindow;

  public async init(): Promise<void> {
    await new Promise(resolve => electron.on("ready", resolve));
    this.window = new BrowserWindow({
      maximizable: true,
      icon: "../icons/icon.ico",
      titleBarStyle: 'hidden',
      frame: false,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: true,
        //@ts-ignore
        enableRemoteModule: true,
      },
    });
    this.config();
    // await this.window.loadURL("http://localhost:4200/");
    try {
      await Promise.all([
        this.window.loadFile(join(__dirname, this.url)),
        this.updateIfNeeded()
      ]);
      this.addUpdateHandler();
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

  private async addUpdateHandler() {
    ipcMain.on("update", async () => {
      const res = await checkUpdate();
      if (res.isUpdateAvailable)
        await downloadAndInstall(res.url, (prog) => {
          this.window.setProgressBar(prog >= 1 ? 2 : prog);
        });
    });
  }
}

new App().init();