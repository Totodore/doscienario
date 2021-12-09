import axios from "axios";
import { app } from "electron";
import { createWriteStream, promises as fs } from "fs";
import { spawn } from "child_process";
import { join, dirname } from "path";


export async function checkUpdate(): Promise<CheckUpdateResult> {
  const currentVersion = app.getVersion();
  const headers = {
    "Authorization": "token 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",
    "User-Agent": "Doscienario " + currentVersion
  };
  let allowedVersions = [];
  try {
    allowedVersions = (await axios.get(`http://localhost:3000/system/check-version?version=${currentVersion}`)).data.versions;
  } catch (e) {
    console.error(e);
    return { isUpdateAvailable: false, lastVersion: currentVersion, mandatory: false };
  }
  console.log("Allowed versions:", allowedVersions);
  const lastVersion = allowedVersions[allowedVersions.length - 1];
  if (lastVersion === currentVersion || !await isInstalled())
    return { isUpdateAvailable: false, lastVersion, mandatory: false };
  try {
    const res = await axios.get(`https://api.github.com/repos/totodore/doscienario/releases/tags/v${lastVersion}`, {
      headers
    });
    const url: string = res.data.assets.find((el: any) => el.name.includes('doscienario.Setup')).url;
    return { isUpdateAvailable: true, lastVersion, url, mandatory: !allowedVersions.includes(currentVersion) };
  } catch (e) {
    console.error(e);
    return { isUpdateAvailable: false, lastVersion, mandatory: false };
  }


}

export const downloadAndInstall = async (url: string, handler: (prog: number) => void) => {
  if (!await isInstalled())
    return;
  const downloadPath = join(dirname(app.getPath('exe')), './update.exe');
  const res = await axios.get(url, {
    headers: {
      "Accept": "application/octet-stream",
      "Authorization": "token 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",
      "User-Agent": "Doscienario " + app.getVersion()
    },
    responseType: 'stream'
  });
  console.log("Downloading update...", downloadPath);
  let chunkSize = 0;
  res.data.pipe(createWriteStream(downloadPath));
  res.data.on('data', (chunk: Buffer) => {
    handler((chunkSize += chunk.length) / +res.headers['content-length']);
  });
  await new Promise<void>((resolve, reject) => {
    res.data.on('end', resolve);
    res.data.on('error', reject);
  });
  await fs.chmod(downloadPath, '755');
  spawn(downloadPath, [], { detached: true, stdio: ['ignore', 'ignore', 'ignore'] }).unref();
  app.quit();
}

const isInstalled = async () => {
  const path = dirname(app.getPath('exe'));
  try {
    return await fs.stat(join(path, "./Uninstall doscienario.exe")) && await fs.stat(join(path, "./doscienario.exe"));
  } catch(e) {
    return false;
  }
}


interface CheckUpdateResult {
  isUpdateAvailable: boolean;
  lastVersion: string;
  mandatory: boolean;
  url?: string;
}