import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { v4 as uuid } from "uuid";
@Injectable({
  providedIn: 'root'
})
export class WorkerManager {

  private worker: Worker;
  private readonly eventListeners: Map<string, WorkerListener<any>[]> = new Map();

  constructor(
    workerType: WorkerType,
    private readonly logger: NGXLogger,
  ) {
    if (typeof Worker === 'undefined')
      alert("Worker not supported, cannot start Doscenario");
    else {
      switch (workerType) {
        case WorkerType.Blueprint:
          this.worker = new Worker("../workers/blueprint.worker", { type: 'module' });          
          break;
        case WorkerType.Editor:
          this.worker = new Worker("../workers/editor.worker", { type: 'module' });
          break;
        case WorkerType.Search:
          this.worker = new Worker("../workers/search.worker", { type: 'module' });
          break;
      }
    }
    this.logger.log("Creating worker for", workerType, this.worker);
    this.worker.onmessage = e => this.onMessage(e);
   }

  addEventListener<Q>(event: string, listener: WorkerListener<Q>): void {
    if (this.eventListeners.has(event)) {
      const array = this.eventListeners.get(event);
      array.push(listener);
      this.eventListeners.set(event, array);
    } else
      this.eventListeners.set(event, [listener]);
  }

  removeEventListener(event: string): boolean {
    return this.eventListeners.delete(event);
  }

  postMessage<Q>(flag: string, message: Q) {
    this.worker.postMessage([flag, message]);
  }
  postAsyncMessage<R, Q = unknown>(flag: string, message: Q): Promise<R> {
    const eventFlag = flag + "-" + uuid();
    const promise = new Promise<R>((resolve, reject) => {
      this.addEventListener(eventFlag, (data: R) => {
        resolve(data);
        this.removeEventListener(eventFlag);
      });
    });
    this.worker.postMessage([eventFlag, message]);
    return promise;
  }

  /**
   * On worker message
   */
  private onMessage(e: MessageEvent<[string, any]>) {
    for (let [event, listeners] of this.eventListeners.entries()) {
      if (e.data[0] == event) {
        for (const listener of listeners)
          listener(e.data[1]);
      }
    }
  }


}

export type WorkerListener<Q> = (data: Q) => void;
export enum WorkerType {
  Blueprint,
  Editor,
  Search
}