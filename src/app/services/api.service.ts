import { ProjectService } from 'src/app/services/project.service';
import { ProjectUserRes } from 'src/app/models/api/project.model';
import { Socket } from 'socket.io-client';
import { GetProjectRes } from './../models/api/project.model';
import { FileRes, ImageRes } from './../models/api/res.model';
import { UserLoginReq } from './../models/api/user.model';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly root: string = `http://${environment.apiUrl}`;
  public socket: typeof Socket;
  constructor(
    private readonly http: HttpClient,
    private readonly project: ProjectService
  ) { }


  public async login(body: UserLoginReq): Promise<boolean> {
    try {
      const res = await this.http.post(`${this.root}/user/auth`, body, { responseType: "text" }).toPromise();
      localStorage.setItem("jwt", res);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async register(body: UserLoginReq): Promise<boolean> {
    try {
      const res = await this.http.post(`${this.root}/user/register`, body, { responseType: "text" }).toPromise();
      localStorage.setItem("jwt", res);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public logout(): boolean {
    try {
      localStorage.removeItem("jwt");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }


	public post<Q, R>(path: string, payload?: Q): Promise<R> {
		return this.http.post<R>(`${this.root}/${path}`, payload, {
			headers: {
        "Authorization": this.jwt,
      }
		}).toPromise();
	}

	public get<R>(path: string): Promise<R> {
		return this.http.get<R>(`${this.root}/${path}`, {
			headers: {
        "Authorization": this.jwt,
      },
			reportProgress: true,
			observe: "body"
		}).toPromise();
  }

  public put<R>(path: string): Promise<R> {
    return this.http.put<R>(`${this.root}/${path}`, {}, {
			headers: {
        "Authorization": this.jwt,
      },
			reportProgress: true,
			observe: "body"
		}).toPromise();
  }

  public delete(path: string): Promise<void> {
    return this.http.delete<void>(`${this.root}/${path}`, {
      headers: {
        "Authorization": this.jwt,
      }
    }).toPromise();
  }

  public patch<Q, R>(path: string, payload?: Q): Promise<R> {
    return this.http.patch<R>(`${this.root}/${path}`, payload, {
      headers: {
        "Authorization": this.jwt,
      }
    }).toPromise();
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

  public async openProject(projectId: number) {
    const res = await this.get<GetProjectRes>(`project/${projectId}`);
    localStorage.setItem("project", projectId.toString());
    this.project.loadData(res);
  }

  public get logged(): boolean {
    return localStorage.getItem("jwt") != null;
  }
  public get inProject(): boolean {
    return localStorage.getItem("project") != null;
  }

  public get jwt(): string {
    return localStorage.getItem("jwt");
  }
  public get user(): ProjectUserRes {
    return JSON.parse(localStorage.getItem("me"));
  }

  private get projectId(): string {
    return localStorage.getItem("project");
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({ "Authorization": this.jwt });
  }
}
