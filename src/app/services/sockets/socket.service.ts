import { ApiService } from 'src/app/services/api.service';
import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AbstractIoHandler } from './abstract-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private _socket: Socket;
  private _handlers: AbstractIoHandler[] = [];

  constructor(
    private readonly api: ApiService
  ) { }

  public connect(project: number) {
    this._socket = new Socket({
      url: `${environment.secured ? "wss" : "ws"}://${environment.apiUrl}`,
      options: {
        path: "/dash",
        query: {
          project: project.toString(),
          authorization: this.api.jwt,
        },
      }
    });
    this._socket.connect();
    for (let handler of this._handlers)
      handler.init();
  }

  public registerHandler(handler: AbstractIoHandler) {
    this._handlers.push(handler);
  }

  public disconnect() {
    for (let handler of this._handlers)
      handler.destroy();
    this._socket?.removeAllListeners();
    this._socket?.disconnect();
    this._socket = null;
  }

  // Wrap socket instance

  public get subscribersCounter(): Record<string, number> {
    return this._socket.subscribersCounter;
  }
  public get eventObservables$(): Record<string, Observable<any>> {
    return this._socket.eventObservables$;
  }
  public of(namespace: string): void {
    return this._socket.of(namespace);
  };
  public on(eventName: string, callback: Function): void {
    return this._socket.on(eventName, callback);
  }
  public once(eventName: string, callback: Function): void {
    return this._socket.once(eventName, callback);
  }
  public emit(_eventName: string, ..._args: any[]): any {
    return this._socket.emit(_eventName, ..._args);
  }
  public removeListener(_eventName: string, _callback?: Function): any {
    return this._socket.removeListener(_eventName, _callback);
  }
  public removeAllListeners(_eventName?: string): any {
    return this._socket.removeAllListeners(_eventName);
  }
  public fromEvent<T>(eventName: string): Observable<T> {
    return this._socket.fromEvent(eventName);
  }
  public fromOneTimeEvent<T>(eventName: string): Promise<T> {
    return this._socket.fromOneTimeEvent(eventName);
  }
}