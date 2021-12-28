import { Injectable } from "@angular/core";
import { INGXLoggerConfig, INGXLoggerLogPosition, INGXLoggerMapperService, INGXLoggerMetadata } from "ngx-logger";
import { Observable, of } from "rxjs";

@Injectable()
export class MapperLoggerService implements INGXLoggerMapperService {
  
  /**
   * Get class name, method and line number from stack trace
   */
  getLogPosition(config: INGXLoggerConfig, metadata: INGXLoggerMetadata): Observable<INGXLoggerLogPosition> {
    const error = new Error();
    let stackLine = 3;
    try {
      throw error;
    } catch (e) {
      const stack = e.stack.split("\n");
      if (!stack[0].includes('.js:')) {
        // The stacktrace starts with no function call (example in Chrome or Edge)
        stackLine++;
      }
      const line: string = stack[stackLine];
      let className: string = line.match(/([A-Z])\w+/g)?.[0] || "<anonymous>";
      let methodName: string = line.match(/(?<=\.)(.+)(?= )/gi)?.[0] || "<anonymous>";
      if (line.match(/new ([A-Z])\w+/g))
        methodName = "constructor";
      return of({ fileName: `${className}::${methodName}` });
    }
  }
}