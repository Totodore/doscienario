import { DbColumn, DbPrimaryColumn } from "src/app/decorators/database-column.decorator";
import { StorableModel } from "./base.db";

export class Logs extends StorableModel {

  @DbPrimaryColumn()
  public id: number;

  @DbColumn()
  public message: string;

  @DbColumn()
  public level: string;

  @DbColumn()
  public createdDate: Date;
}