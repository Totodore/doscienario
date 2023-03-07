import { Injectable } from '@angular/core';
import { GrpcDataEvent, GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler, GrpcInterceptor } from '@ngx-grpc/core';
import { NGXLogger } from 'ngx-logger';
import { isObservable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GrpcLoggerInterceptor implements GrpcInterceptor {

  private static requestId = 0;

  constructor(
    private readonly _logger: NGXLogger
  ) { }

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler) {
    const id = ++GrpcLoggerInterceptor.requestId;
    const start = Date.now();

    // check if client streaming, then push each value separately
    if (isObservable(request.requestData)) {
      request.requestData = request.requestData.pipe(
        tap(msg => {
          this._logger.log(`#${id}: ${Date.now() - start}ms -> ${request.path}`, msg);
        }),
      );
    }

    // handle unary calls and server streaming in the same manner
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof GrpcDataEvent) {
          this._logger.log(`#${id}: ${Date.now() - start}ms -> ${request.path}`, event.data);
        } else if (event.statusCode !== 0) {
          this._logger.error(`#${id}:`, event);
        }
      }),
    );
  }

}