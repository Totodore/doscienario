import { UserDetailsRes } from './../api/user.model';
export class Tag {

  constructor(
    public name: string,
    color?: string
  ) {
    this.color = color;
  }
  id: number;

  primary: boolean;

  projectId: number;

  createdById: string;

  color: string;

  createdBy: UserDetailsRes;
}
