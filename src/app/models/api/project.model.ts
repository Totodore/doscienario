import { DocumentTypes } from './../document-types.enum';
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

  createdDate: string;

  users: ProjectUserRes[];

  createdBy: ProjectUserRes;

  documents: GetProjectDocumentRes[];

  blueprints: GetProjectBlueprintRes[];

  tags: GetProjectTagRes[];

  files: File[];
}

export interface GetProjectDocumentRes {
  id: number;

  createdDate: string;

  type: DocumentTypes;

  images: GetProjectDocumentImageRes[];
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

export interface GetProjectTagRes {
  id: number;

  name: string;

  projectId: number;

  createdById: string;

  color: string;

}

export interface GetProjectBlueprintRes {

  id: number;

  name: string;

}