import { DataModel, DataType } from '../default.model';
import { UserDetailsRes } from './../api/user.model';
export class Tag extends DataModel {

  constructor(obj: DataModel);
  constructor(name: string, color?: string, primary?: boolean);

  constructor(
    name: string | DataModel,
    color?: string,
    primary: boolean = false
  ) {
    if (typeof name !== "string") {
      super(name);
      this.color = color;
      this.primary = primary
    }
    else {
      super();
      this.name = name;
    }
    this.type = DataType.Tag;
  }

  name: string;

  id: number;

  primary: boolean;

  projectId: number;

  createdById: string;

  color: string;

  createdBy: UserDetailsRes;

  type: DataType.Tag;
}

export class UpdateTagColorReq {
  constructor(
    public name: string,
    public color: string
  ) { }
}
export class UpdateTagNameReq {
  constructor(
    public oldName: string,
    public name: string
  ) { }
}
