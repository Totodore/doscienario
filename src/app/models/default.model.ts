import { Document } from "./api/project.model";
import { Blueprint } from "./sockets/blueprint-sock.model";
export abstract class DataModel {

  constructor(obj?: DataModel) {
    if (obj)
      Object.assign(this, obj);
  }
}

export enum DataType {
  Blueprint,
  Document,
  Tag
}

export type ElementModel = Blueprint | Document;