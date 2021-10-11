
export class ColorElementReq {
  constructor(
    public docId: number,
    public color: string,
  ) { }
}
export class ColorElementRes extends ColorElementReq { }