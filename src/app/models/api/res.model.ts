export interface FileRes {
  id: string;

  projectId: number;

  createdById: string;

  createdDate: string;

  mime: string;

  path: string;

  size: number;
}

export interface ImageRes {
  id: string;

  size: number;

  height: number;

  width: number;

  uploadedDate: string;

  documentPos: number;

  documentId: number;
}
