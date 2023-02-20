import { DbColumn, DbPrimaryColumn, DbPrimaryGeneratedColumn, DbTable, DbUniqueColumn } from 'src/app/decorators/database-column.decorator';

@DbTable()
export class KeyStore {

  @DbPrimaryColumn()
  public key: string;

  @DbColumn()
  public projectId: string;

  @DbColumn()
  public value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}
