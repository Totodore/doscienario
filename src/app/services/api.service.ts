import { Logs } from 'src/app/models/api/logs.model';
import { DbService } from './database/db.service';
import { ProgressService } from './ui/progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { Socket } from 'socket.io-client';
import { Project } from './../models/api/project.model';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { version } from '../../../package.json';
import { ApiUtil } from '../utils/api.util';
import { VersionCheckRes } from '../models/api/system.model';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends ApiUtil {

  public socket: typeof Socket;
  constructor(
    http: HttpClient,
    logger: NGXLogger,
    private readonly project: ProjectService,
    private readonly progress: ProgressService,
    private readonly db: DbService,
  ) {
    super(http, logger);
  }


  public async importProject(file: Blob): Promise<boolean> {
    this.progress.show(true);
    const form = new FormData();
    form.append("data", file);
    const req = new HttpRequest("POST", `${this.root}/project/import`, form, { reportProgress: true, headers: this.headers });
    return new Promise<boolean>((resolve) => {
      this.http.request<void>(req).subscribe((e: HttpEvent<any>) => {
        if (e.type === HttpEventType.UploadProgress) {
          const prog = (e.loaded / e.total) * 100;
          this.progress.updateValue(prog);
          if (prog === 100) {
            this.progress.updateValue(0);
            this.progress.show(false);
          }
        } else if (e.type === HttpEventType.Response)
          resolve(e.ok);
      });
    });
  }

  public async openProject(projectId: number) {
    const res = await this.get<Project>(`project/${projectId}`);
    localStorage.setItem("project", projectId.toString());
    this.project.loadData(res);
  }

  public async bugReport(message: string) {
    this.progress.show();
    try {
      const data = (await this.db.getAll(Logs, ["message", "level"])).map(l => l.level + " - " + l.message).join("\n");
      await this.post("system/bug-report", { data, message });
    } finally {
      this.progress.hide();
    }
  }

  public async checkApiVersion() {
    const res = await this.get<VersionCheckRes>(`system/check-version?version=${version}`);
    return res.allowed ? true : res.versions;
  }

  public get inProject(): boolean {
    return localStorage.getItem("project") != null;
  }

  private get projectId(): string {
    return localStorage.getItem("project");
  }
}
