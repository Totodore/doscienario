import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { User } from "../models/api/project.model";
import { UserLoginReq } from "../models/api/user.model";

export class ApiUtil {

  constructor(
    protected http: HttpClient,
  ) { }

  public readonly root: string = `${environment.secured ? "https" : "http"}://${environment.apiUrl}`;

  
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