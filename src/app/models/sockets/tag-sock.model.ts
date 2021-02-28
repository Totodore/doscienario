import { UserDetailsRes } from './../api/user.model';
export class Tag {

  constructor(
    public name: string
  ) {}
  id: number;

  primary: boolean;

  projectId: number;

  createdById: string;

  color: string;

  createdBy: UserDetailsRes;
}
