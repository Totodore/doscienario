import { DbColumn, DbPrimaryColumn, DbPrimaryGeneratedColumn, DbTable } from "src/app/decorators/database-column.decorator";

@DbTable()
export class Logs {

  @DbPrimaryGeneratedColumn()
  public id: number;

  @DbColumn()
  public message: string;

  @DbColumn()
  public level: string;

}