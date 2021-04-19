import { WorkerManager, WorkerType } from './../utils/worker-manager.utils';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentWorkerService {

  public worker: WorkerManager;

  constructor() {
    this.worker = new WorkerManager(WorkerType.Document);
  }

}
