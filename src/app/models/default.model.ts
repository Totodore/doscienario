export abstract class DataModel {

  constructor(obj?: DataModel) {
    if (obj)
      Object.assign(this, obj);
  }
}

export enum DataType {
  Blueprint,
  Document,
  Tag
}
