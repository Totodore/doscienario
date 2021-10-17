import { DataModel } from '../default.model';
import { Blueprint } from './blueprint.model';
import { Document } from './document.model';
import { Tag } from './tag.model';
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

export interface Image {
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
