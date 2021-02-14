export interface UserLoginReq {
  password: string;
  name: string;
}
export interface UserDetailsRes {
  id: string;

  name: string;

  projects: UserProjectsRes[];
}

export interface UserProjectsRes {
  id: number;

  name: string;

  createdDate: Date;
}
