import { Injectable } from '@angular/core';
import { GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler, GrpcInterceptor } from '@ngx-grpc/core';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class GrpcAuthInterceptor implements GrpcInterceptor {

  constructor(
    private readonly api: ApiService,
  ) { }

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler) {
    console.log(request.requestMetadata);
    request.requestMetadata.set("authorization", this.api.jwt);
    return next.handle(request);
  }
}