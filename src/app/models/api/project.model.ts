import { Blueprint } from './../sockets/blueprint-sock.model';
import { Tag } from './../sockets/tag-sock.model';
import { DataType } from '../default.model';
export interface CreateProjectReq {
  name: string;
}
export interface CreateProjectRes {

  id: number;

  name: string;

  createdDate: Date;

  users: ProjectUserRes[];

  createdBy: ProjectUserRes;
}

export interface ProjectUserRes {
  id: string;

  name: string;
}

export interface GetProjectRes {

  id: number;

  name: string;

  createdDate: Date;

  users: ProjectUserRes[];

  createdBy: ProjectUserRes;

  documents: Document[];

  blueprints: Blueprint[];

  tags: Tag[];

  files: File[];
}

export interface Document {
  id: number;

  createdDate: Date;

  tags: Tag[];

  images?: GetProjectDocumentImageRes[];

  title: string;

  lastEditing?: Date;

  readonly type: DataType.Document;
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
