import { DbColumn, DbPrimaryColumn, DbTable } from "src/app/decorators/database-column.decorator";

@DbTable()
export class Logs {

  @DbPrimaryColumn()
  public id: number;

  @DbColumn()
  public message: string;

  // @DbColumn()
  public level: string;

  @DbColumn()
  public createdDate: Date;
}