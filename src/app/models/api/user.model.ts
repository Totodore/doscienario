export interface UserLoginReq {
  password: string;
  name: string;
}

export interface UserProjectsRes {
  id: number;

  name: string;

  createdDate: Date;
}
