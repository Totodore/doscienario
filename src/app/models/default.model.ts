import { Project, User } from "./api/project.model";
import { Tag } from "./api/tag.model";
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
  Tag,
  Sheet
}

export abstract class Element<T = any> extends DataModel<T> implements IElement {
  public id: number;
  public uid: string;
  public title: string;
  public tags: Tag[];
  public project: Project;
  public projectId: number;
  public color: string;
  public type: DataType;
}
export abstract class ContentElement extends Element {
  public content: string;
}
export interface IElement {
  type: DataType;
}