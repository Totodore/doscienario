/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import { Inject, Injectable, Optional } from '@angular/core';
import {
  GrpcCallType,
  GrpcClient,
  GrpcClientFactory,
  GrpcEvent,
  GrpcMetadata
} from '@ngx-grpc/common';
import {
  GRPC_CLIENT_FACTORY,
  GrpcHandler,
  takeMessages,
  throwStatusErrors
} from '@ngx-grpc/core';
import { Observable } from 'rxjs';
import * as thisProto from './docs.pb';
import { GRPC_DOCS_CLIENT_SETTINGS } from './docs.pbconf';
/**
 * Service client implementation for docs.Docs
 */
@Injectable({ providedIn: 'any' })
export class DocsClient {
  private client: GrpcClient<any>;

  /**
   * Raw RPC implementation for each service client method.
   * The raw methods provide more control on the incoming data and events. E.g. they can be useful to read status `OK` metadata.
   * Attention: these methods do not throw errors when non-zero status codes are received.
   */
  $raw = {
    /**
     * Unary call: /docs.Docs/OpenDoc
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.OpenDocResponse>>
     */
    openDoc: (
      requestData: thisProto.OpenDocRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.OpenDocResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/docs.Docs/OpenDoc',
        requestData,
        requestMetadata,
        requestClass: thisProto.OpenDocRequest,
        responseClass: thisProto.OpenDocResponse
      });
    },
    /**
     * Unary call: /docs.Docs/CloseDoc
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    closeDoc: (
      requestData: thisProto.DocIdentityRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/docs.Docs/CloseDoc',
        requestData,
        requestMetadata,
        requestClass: thisProto.DocIdentityRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Server streaming: /docs.Docs/SubscribeDoc
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.DocEvent>>
     */
    subscribeDoc: (
      requestData: thisProto.DocIdentityRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.DocEvent>> => {
      return this.handler.handle({
        type: GrpcCallType.serverStream,
        client: this.client,
        path: '/docs.Docs/SubscribeDoc',
        requestData,
        requestMetadata,
        requestClass: thisProto.DocIdentityRequest,
        responseClass: thisProto.DocEvent
      });
    },
    /**
     * Unary call: /docs.Docs/WriteDoc
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    writeDoc: (
      requestData: thisProto.DocWriteRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/docs.Docs/WriteDoc',
        requestData,
        requestMetadata,
        requestClass: thisProto.DocWriteRequest,
        responseClass: thisProto.Empty
      });
    },
    /**
     * Unary call: /docs.Docs/CRCCheck
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.CRCCheckResponse>>
     */
    cRCCheck: (
      requestData: thisProto.CRCCheckRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.CRCCheckResponse>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/docs.Docs/CRCCheck',
        requestData,
        requestMetadata,
        requestClass: thisProto.CRCCheckRequest,
        responseClass: thisProto.CRCCheckResponse
      });
    },
    /**
     * Unary call: /docs.Docs/RemoveDoc
     *
     * @param requestMessage Request message
     * @param requestMetadata Request metadata
     * @returns Observable<GrpcEvent<thisProto.Empty>>
     */
    removeDoc: (
      requestData: thisProto.DocIdentityRequest,
      requestMetadata = new GrpcMetadata()
    ): Observable<GrpcEvent<thisProto.Empty>> => {
      return this.handler.handle({
        type: GrpcCallType.unary,
        client: this.client,
        path: '/docs.Docs/RemoveDoc',
        requestData,
        requestMetadata,
        requestClass: thisProto.DocIdentityRequest,
        responseClass: thisProto.Empty
      });
    }
  };

  constructor(
    @Optional() @Inject(GRPC_DOCS_CLIENT_SETTINGS) settings: any,
    @Inject(GRPC_CLIENT_FACTORY) clientFactory: GrpcClientFactory<any>,
    private handler: GrpcHandler
  ) {
    this.client = clientFactory.createClient('docs.Docs', settings);
  }

  /**
   * Unary call @/docs.Docs/OpenDoc
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.OpenDocResponse>
   */
  openDoc(
    requestData: thisProto.OpenDocRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.OpenDocResponse> {
    return this.$raw
      .openDoc(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/docs.Docs/CloseDoc
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  closeDoc(
    requestData: thisProto.DocIdentityRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .closeDoc(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Server streaming @/docs.Docs/SubscribeDoc
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.DocEvent>
   */
  subscribeDoc(
    requestData: thisProto.DocIdentityRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.DocEvent> {
    return this.$raw
      .subscribeDoc(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/docs.Docs/WriteDoc
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  writeDoc(
    requestData: thisProto.DocWriteRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .writeDoc(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/docs.Docs/CRCCheck
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.CRCCheckResponse>
   */
  cRCCheck(
    requestData: thisProto.CRCCheckRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.CRCCheckResponse> {
    return this.$raw
      .cRCCheck(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }

  /**
   * Unary call @/docs.Docs/RemoveDoc
   *
   * @param requestMessage Request message
   * @param requestMetadata Request metadata
   * @returns Observable<thisProto.Empty>
   */
  removeDoc(
    requestData: thisProto.DocIdentityRequest,
    requestMetadata = new GrpcMetadata()
  ): Observable<thisProto.Empty> {
    return this.$raw
      .removeDoc(requestData, requestMetadata)
      .pipe(throwStatusErrors(), takeMessages());
  }
}
