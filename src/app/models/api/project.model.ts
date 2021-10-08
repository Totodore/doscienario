import { Blueprint } from './../sockets/blueprint-sock.model';
import { Tag } from './../sockets/tag-sock.model';
import { DataModel, DataType, Element, IElement } from '../default.model';
export interface CreateProjectReq {
  name: string;
}
export class User {
  public id: string;
  public name: string;
  public projects?: Project[];
}

export class Project extends DataModel<Project> {
  public id: number;
  public name: string;
  public users: User[];
  public createdBy: User;
  public documents: Document[];
  public blueprints: Blueprint[];
  public tags: Tag[];
  public files: File[];
}

export class Document extends Element implements IElement {

  public id: number;
  public images?: GetProjectDocumentImageRes[];
  public content: string;
  public readonly type = DataType.Document;
}

export interface GetProjectDocumentImageRes {
  id: string;

  size: number;

  height: number;

  width: number;

  uploadedDate: Date;

  documentPos: number;

  documentId: number;
}

export interface SearchQueryRes {
  docs: number[];
  tags: string[];
}

export type SearchResults = (Document | Tag | Blueprint)[];
