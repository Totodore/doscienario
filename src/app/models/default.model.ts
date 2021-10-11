import { Document, Project, User } from "./api/project.model";
import { Blueprint } from "./sockets/blueprint-sock.model";
import { Tag } from "./sockets/tag-sock.model";
export abstract class DataModel<T> {

  constructor(obj?: Partial<T>) {
    if (obj)
      Object.assign(this, obj);
  }
  public id: number | string;
  public createdById: number;
  public lastEditor: User;
  public createdBy: User;
  public lastEditorId: string;
  public lastEditing: Date;
  public createdDate: Date;
}

export enum DataType {
  Blueprint,
  Document,
  Tag
}

export abstract class Element<T = any> extends DataModel<T> {
  public id: number;
  public uid: string;
  public title: string;
  public tags: Tag[];
  public project: Project;
  public projectId: number;
  public color: string;
}
export interface IElement extends Element {
  type: DataType;
}
export type ElementModel = Blueprint | Document;