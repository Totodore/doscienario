export class RenameTagOut {
  constructor(
    public title: string,
    public oldTitle: string
  ) {}
}

export class ColorTagOut {
  constructor(
    public color: string,
    public title: string
  ) {}
}

export class AddTagElementOut {
  constructor(
    public elementId: number,
    public title: string,
  ) {}
}
export class RemoveTagElementOut extends AddTagElementOut { };