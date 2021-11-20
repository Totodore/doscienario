import { DataModel, DataType } from "../default.model";

export class Tag extends DataModel<Tag> {

  constructor(obj: Partial<Tag>);
  constructor(name: string, color?: string);

  constructor(
    name: string | Partial<Tag>,
    color?: string,
  ) {
    super(typeof name !== "string" ? name : {});
    if (typeof name === "string") {
      this.title = name;
      this.color = color;
    }
    this.type = DataType.Tag;
  }
  public id: number;
  public projectId: number;
  public title: string;
  public color: string;
  public readonly type = DataType.Tag;
}