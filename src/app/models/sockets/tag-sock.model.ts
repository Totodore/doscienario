import { UserDetailsRes } from './../api/user.model';
export class Tag {

  constructor(
    public name: string,
    color?: string,
    primary: boolean = false
  ) {
    this.color = color;
    this.primary = primary
  }
  id: number;

  primary: boolean;

  projectId: number;

  createdById: string;

  color: string;

  createdBy: UserDetailsRes;
}

export class UpdateTagColorReq {
  constructor(
    public name: string,
    public color: string
  ) {}
}
export class UpdateTagNameReq {
  constructor(
    public oldName: string,
    public name: string
  ) {}
}
