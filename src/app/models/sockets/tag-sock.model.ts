import { DataModel, DataType, Element } from '../default.model';
export class Tag extends Element<Tag> {

  constructor(obj: Partial<Tag>);
  constructor(name: string, color?: string, primary?: boolean);

  constructor(
    name: string | Partial<Tag>,
    color?: string,
    primary?: boolean
  ) {
    super(typeof name !== "string" ? name : {});
    if (typeof name === "string") {
      this.title = name;
      this.color = color;
      this.primary = primary
    }
    this.type = DataType.Tag;
  }

  public primary: boolean;
  public color: string;
  public readonly type = DataType.Tag;
}

export class UpdateTagColorReq {
  constructor(
    public title: string,
    public color: string
  ) { }
}
export class UpdateTagNameReq {
  constructor(
    public oldTitle: string,
    public title: string
  ) { }
}
