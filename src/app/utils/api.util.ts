import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NGXLogger } from "ngx-logger";
import { environment } from "src/environments/environment";
import { User } from "../models/api/project.model";
import { UserLoginReq } from "../models/api/user.model";
import { lastValueFrom } from "rxjs";
export class ApiUtil {

  constructor(
    protected http: HttpClient,
    protected logger: NGXLogger,
  ) { }

  public readonly root: string = `${environment.secured ? "https" : "http"}://${environment.apiUrl}`;

  
  public async login(body: UserLoginReq): Promise<boolean> {
    try {
      const res = await lastValueFrom(this.http.post(`${this.root}/user/auth`, body, { responseType: "text" }));
      localStorage.setItem("jwt", res);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  public async register(body: UserLoginReq): Promise<boolean> {
    try {
      const res = await lastValueFrom(this.http.post(`${this.root}/user/register`, body, { responseType: "text" }));
      localStorage.setItem("jwt", res);
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  public logout(): boolean {
    try {
      localStorage.removeItem("jwt");
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }


  public post<Q, R>(path: string, payload?: Q): Promise<R> {
    return lastValueFrom(this.http.post<R>(`${this.root}/${path}`, payload, {
      headers: {
        "Authorization": this.jwt ?? "",
      }
    }));
  }

  public get<R>(path: string): Promise<R> {
    return lastValueFrom(this.http.get<R>(`${this.root}/${path}`, {
      headers: {
        "Authorization": this.jwt ?? "",
      },
      reportProgress: true,
      observe: "body"
    }));
  }

  public put<R>(path: string): Promise<R> {
    return lastValueFrom(this.http.put<R>(`${this.root}/${path}`, {}, {
      headers: {
        "Authorization": this.jwt ?? "",
      },
      reportProgress: true,
      observe: "body"
    }));
  }

  public delete(path: string): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.root}/${path}`, {
      headers: {
        "Authorization": this.jwt ?? "",
      }
    }));
  }

  public patch<Q, R>(path: string, payload?: Q): Promise<R> {
    return lastValueFrom(this.http.patch<R>(`${this.root}/${path}`, payload, {
      headers: {
        "Authorization": this.jwt ?? "",
      }
    }));
  }

  
  public get logged(): boolean {
    return localStorage.getItem("jwt") != null;
  }

  public get jwt(): string {
    return localStorage.getItem("jwt");
  }
  public get user(): User {
    return JSON.parse(localStorage.getItem("me"));
  }

  
  protected get headers(): HttpHeaders {
    return new HttpHeaders({ "Authorization": this.jwt });
  }
}