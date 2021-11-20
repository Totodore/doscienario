export class OpenSheetOut {
  constructor(
    public reqId: string,
    public documentId: number,
    public elementId?: number,
    public title?: string,
  ) { }
}