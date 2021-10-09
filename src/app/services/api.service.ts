import { ProgressService } from './progress.service';
import { ProjectService } from 'src/app/services/project.service';
import { Socket } from 'socket.io-client';
import { Project } from './../models/api/project.model';
import { FileRes, ImageRes } from './../models/api/res.model';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUtil } from '../utils/api.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService extends ApiUtil {

  public socket: typeof Socket;
  constructor(
    http: HttpClient,
    private readonly project: ProjectService,
    private readonly progress: ProgressService
  ) {
    super(http);
  }

  public postFile(file: File, path: string): Observable<HttpEvent<FileRes>> {
    const form = new FormData();
    form.append("file", file);
    form.append("path", path);
    form.append("projectId", this.projectId);
    const req = new HttpRequest("POST", `${this.root}/res/file`, form, { reportProgress: true, headers: this.headers });

    return this.http.request<FileRes>(req);
  }

  public async postImage(imgUrl: string, pos: number, docId: number): Promise<Observable<HttpEvent<ImageRes>>> {
    const form = new FormData();
    const blob = await (await fetch(imgUrl)).blob();
    form.append("file", blob);
    form.append("documentPos", pos.toString());
    form.append("documentId", docId.toString());
    form.append("projectId", this.projectId);
    const req = new HttpRequest("POST", `${this.root}/res/image`, form, { reportProgress: true, headers: this.headers });

    return this.http.request<ImageRes>(req);
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

  public get inProject(): boolean {
    return localStorage.getItem("project") != null;
  }

  private get projectId(): string {
    return localStorage.getItem("project");
  }
}
