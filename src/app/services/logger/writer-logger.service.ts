
import { DbService } from './../database/db.service';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { INGXLoggerConfig, INGXLoggerMetadata, NgxLoggerLevel, NGXLoggerWriterService } from "ngx-logger";
import { Logs } from "src/app/models/api/logs.model";

/**
 * Change the default logger metadata string
 * Log to the database with also console
 */
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


  /**
   * Add Log entry to local db after logging in normal console
   */
  protected logModern(metadata: INGXLoggerMetadata, config: INGXLoggerConfig, metaString: string): void {
    super.logModern(metadata, config, metaString);
    try {
      this.db.add(Logs, {
        message: `${metaString} ${metadata.message} ${metadata.additional?.map(s => typeof s === "object" ? JSON.stringify(s) : s)?.join(' ')}`,
        level: NgxLoggerLevel[metadata.level],
      });
    } catch (e) {
      console.error("No saved logs", e);
    }
  }
}