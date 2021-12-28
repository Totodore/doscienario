import { Injectable } from "@angular/core";
import { INGXLoggerConfig, INGXLoggerMetadata, INGXLoggerWriterService, NGXLoggerWriterService } from "ngx-logger";

@Injectable()
export class WriterLoggerService extends NGXLoggerWriterService {
  
  protected prepareMetaString(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): string {
    return `[${metadata.timestamp}] [${metadata.fileName}]`;
  }
}