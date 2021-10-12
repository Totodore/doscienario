import { AppImageUpdater, NsisUpdater } from "electron-updater"
import { AllPublishOptions } from "electron-updater/node_modules/builder-util-runtime";
import { BaseUpdater } from "electron-updater/out/BaseUpdater";

export const checkAndUpdate = () => {

  let updater: BaseUpdater;
  const options: AllPublishOptions = {
    private: true,
    token: "dc40612a01f34ea5a2c073e2203edfd2b65003a0",
    provider: "github",
    url: 'https://github.com/totodore/doscienario',
    releaseType: "release"
  }

  if (process.platform === "win32")
    updater = new NsisUpdater(options)
  else if (process.platform !== "darwin")
    updater = new AppImageUpdater(options);
  updater.autoDownload = true;
  updater.checkForUpdatesAndNotify();
}