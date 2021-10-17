import { Tag } from "../../api/tag.model";

export class AddTagElementIn {
  constructor(
    public docId: number,
    public tag: Tag,
  ) {}
}
export class RemoveTagElementIn {
  constructor(
    public elementId: number,
    public title: string
  ) {}
};

export class RenameTagIn {
  constructor(
    public title: string,
    public oldTitle: string
  ) {}
}

export class ColorTagIn {
  constructor(
    public color: string,
    public title: string
  ) {}
}