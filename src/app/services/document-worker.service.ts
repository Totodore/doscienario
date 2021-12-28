import { WorkerManager, WorkerType } from './../utils/worker-manager.utils';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class EditorWorkerService {

  public worker: WorkerManager;

  constructor(
    logger: NGXLogger,
  ) {
    this.worker = new WorkerManager(WorkerType.Editor, logger);
  }

}
