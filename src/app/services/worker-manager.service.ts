import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkerManagerService {

  private worker: Worker;
  private readonly eventListeners: Map<string, WorkerListener<any>[]> = new Map();

  constructor() {
    if (typeof Worker === 'undefined')
      alert("Worker not supported, cannot start Doscenario");
    else
      this.worker = new Worker('../app.worker', { type: 'module' });
    console.log("Worker", this.worker);
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
