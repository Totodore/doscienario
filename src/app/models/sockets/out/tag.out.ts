export class RenameTagOut {
  constructor(
    public oldTitle: string,
    public title: string,
  ) {}
}

export class ColorTagOut {
  constructor(
    public title: string,
    public color: string,
  ) {}
}

export class AddTagElementOut {
  constructor(
    public elementId: number,
    public title: string,
  ) {}
}
export class RemoveTagElementOut extends AddTagElementOut { };