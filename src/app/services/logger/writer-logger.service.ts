import { DbService } from './../database/db.service';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { INGXLoggerConfig, INGXLoggerMetadata, INGXLoggerWriterService, NgxLoggerLevel, NGXLoggerWriterService } from "ngx-logger";
import { Logs } from "src/app/models/api/logs.model";

@Injectable()
export class WriterLoggerService extends NGXLoggerWriterService {
  
  constructor(
    @Inject(PLATFORM_ID) platformId: any,
    private readonly db: DbService,
  ) { 
    super(platformId);
  }

  protected prepareMetaString(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): string {
    return `[${metadata.timestamp}] [${metadata.fileName}]`;
  }


  protected logModern(metadata: INGXLoggerMetadata, config: INGXLoggerConfig, metaString: string): void {
    super.logModern(metadata, config, metaString);
    this.db.add(Logs, {
      message: `${metaString} ${metadata.message} ${metadata.additional?.join(' ')}`,
      level: NgxLoggerLevel[metadata.level],
    });
  }
}