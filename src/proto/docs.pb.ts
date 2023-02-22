/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
//
// THIS IS A GENERATED FILE
// DO NOT MODIFY IT! YOUR CHANGES WILL BE LOST
import {
  GrpcMessage,
  RecursivePartial,
  ToProtobufJSONOptions
} from '@ngx-grpc/common';
import { BinaryReader, BinaryWriter, ByteSource } from 'google-protobuf';

/**
 * Message implementation for docs.Empty
 */
export class Empty implements GrpcMessage {
  static id = 'docs.Empty';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Empty();
    Empty.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Empty) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Empty, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        default:
          _reader.skipField();
      }
    }

    Empty.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Empty, _writer: BinaryWriter) {}

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Empty to deeply clone from
   */
  constructor(_value?: RecursivePartial<Empty.AsObject>) {
    _value = _value || {};
    Empty.refineValues(this);
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Empty.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Empty.AsObject {
    return {};
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Empty.AsProtobufJSON {
    return {};
  }
}
export module Empty {
  /**
   * Standard JavaScript object representation for Empty
   */
  export interface AsObject {}

  /**
   * Protobuf JSON representation for Empty
   */
  export interface AsProtobufJSON {}
}

/**
 * Message implementation for docs.Insert
 */
export class Insert implements GrpcMessage {
  static id = 'docs.Insert';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Insert();
    Insert.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Insert) {
    _instance.position = _instance.position || 0;
    _instance.content = _instance.content || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Insert, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.position = _reader.readInt32();
          break;
        case 2:
          _instance.content = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Insert.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Insert, _writer: BinaryWriter) {
    if (_instance.position) {
      _writer.writeInt32(1, _instance.position);
    }
    if (_instance.content) {
      _writer.writeString(2, _instance.content);
    }
  }

  private _position: number;
  private _content: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Insert to deeply clone from
   */
  constructor(_value?: RecursivePartial<Insert.AsObject>) {
    _value = _value || {};
    this.position = _value.position;
    this.content = _value.content;
    Insert.refineValues(this);
  }
  get position(): number {
    return this._position;
  }
  set position(value: number) {
    this._position = value;
  }
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Insert.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Insert.AsObject {
    return {
      position: this.position,
      content: this.content
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Insert.AsProtobufJSON {
    return {
      position: this.position,
      content: this.content
    };
  }
}
export module Insert {
  /**
   * Standard JavaScript object representation for Insert
   */
  export interface AsObject {
    position: number;
    content: string;
  }

  /**
   * Protobuf JSON representation for Insert
   */
  export interface AsProtobufJSON {
    position: number;
    content: string;
  }
}

/**
 * Message implementation for docs.Remove
 */
export class Remove implements GrpcMessage {
  static id = 'docs.Remove';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Remove();
    Remove.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Remove) {
    _instance.position = _instance.position || 0;
    _instance.size = _instance.size || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(_instance: Remove, _reader: BinaryReader) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.position = _reader.readInt32();
          break;
        case 2:
          _instance.size = _reader.readInt32();
          break;
        default:
          _reader.skipField();
      }
    }

    Remove.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Remove, _writer: BinaryWriter) {
    if (_instance.position) {
      _writer.writeInt32(1, _instance.position);
    }
    if (_instance.size) {
      _writer.writeInt32(2, _instance.size);
    }
  }

  private _position: number;
  private _size: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Remove to deeply clone from
   */
  constructor(_value?: RecursivePartial<Remove.AsObject>) {
    _value = _value || {};
    this.position = _value.position;
    this.size = _value.size;
    Remove.refineValues(this);
  }
  get position(): number {
    return this._position;
  }
  set position(value: number) {
    this._position = value;
  }
  get size(): number {
    return this._size;
  }
  set size(value: number) {
    this._size = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Remove.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Remove.AsObject {
    return {
      position: this.position,
      size: this.size
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Remove.AsProtobufJSON {
    return {
      position: this.position,
      size: this.size
    };
  }
}
export module Remove {
  /**
   * Standard JavaScript object representation for Remove
   */
  export interface AsObject {
    position: number;
    size: number;
  }

  /**
   * Protobuf JSON representation for Remove
   */
  export interface AsProtobufJSON {
    position: number;
    size: number;
  }
}

/**
 * Message implementation for docs.Replace
 */
export class Replace implements GrpcMessage {
  static id = 'docs.Replace';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new Replace();
    Replace.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: Replace) {
    _instance.content = _instance.content || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: Replace,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.content = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    Replace.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: Replace, _writer: BinaryWriter) {
    if (_instance.content) {
      _writer.writeString(1, _instance.content);
    }
  }

  private _content: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of Replace to deeply clone from
   */
  constructor(_value?: RecursivePartial<Replace.AsObject>) {
    _value = _value || {};
    this.content = _value.content;
    Replace.refineValues(this);
  }
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    Replace.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): Replace.AsObject {
    return {
      content: this.content
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): Replace.AsProtobufJSON {
    return {
      content: this.content
    };
  }
}
export module Replace {
  /**
   * Standard JavaScript object representation for Replace
   */
  export interface AsObject {
    content: string;
  }

  /**
   * Protobuf JSON representation for Replace
   */
  export interface AsProtobufJSON {
    content: string;
  }
}

/**
 * Message implementation for docs.OpenDocRequest
 */
export class OpenDocRequest implements GrpcMessage {
  static id = 'docs.OpenDocRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new OpenDocRequest();
    OpenDocRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: OpenDocRequest) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
    _instance.sessionId = _instance.sessionId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: OpenDocRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.userId = _reader.readString();
          break;
        case 3:
          _instance.sessionId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    OpenDocRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: OpenDocRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(2, _instance.userId);
    }
    if (_instance.sessionId) {
      _writer.writeInt64String(3, _instance.sessionId);
    }
  }

  private _id: number;
  private _userId: string;
  private _sessionId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of OpenDocRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<OpenDocRequest.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    this.sessionId = _value.sessionId;
    OpenDocRequest.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    OpenDocRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): OpenDocRequest.AsObject {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): OpenDocRequest.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }
}
export module OpenDocRequest {
  /**
   * Standard JavaScript object representation for OpenDocRequest
   */
  export interface AsObject {
    id: number;
    userId: string;
    sessionId: string;
  }

  /**
   * Protobuf JSON representation for OpenDocRequest
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
    sessionId: string;
  }
}

/**
 * Message implementation for docs.OpenDocResponse
 */
export class OpenDocResponse implements GrpcMessage {
  static id = 'docs.OpenDocResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new OpenDocResponse();
    OpenDocResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: OpenDocResponse) {
    _instance.id = _instance.id || 0;
    _instance.uid = _instance.uid || '';
    _instance.color = _instance.color || '';
    _instance.createdDate = _instance.createdDate || '';
    _instance.lastEditing = _instance.lastEditing || '';
    _instance.content = _instance.content || '';
    _instance.title = _instance.title || '';
    _instance.changeId = _instance.changeId || '0';
    _instance.sheets = _instance.sheets || [];
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: OpenDocResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.uid = _reader.readString();
          break;
        case 3:
          _instance.color = _reader.readString();
          break;
        case 4:
          _instance.createdDate = _reader.readString();
          break;
        case 5:
          _instance.lastEditing = _reader.readString();
          break;
        case 6:
          _instance.content = _reader.readString();
          break;
        case 8:
          _instance.title = _reader.readString();
          break;
        case 9:
          _instance.changeId = _reader.readUint64String();
          break;
        case 10:
          const messageInitializer10 = new SheetEntity();
          _reader.readMessage(
            messageInitializer10,
            SheetEntity.deserializeBinaryFromReader
          );
          (_instance.sheets = _instance.sheets || []).push(
            messageInitializer10
          );
          break;
        default:
          _reader.skipField();
      }
    }

    OpenDocResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: OpenDocResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.uid) {
      _writer.writeString(2, _instance.uid);
    }
    if (_instance.color) {
      _writer.writeString(3, _instance.color);
    }
    if (_instance.createdDate) {
      _writer.writeString(4, _instance.createdDate);
    }
    if (_instance.lastEditing) {
      _writer.writeString(5, _instance.lastEditing);
    }
    if (_instance.content) {
      _writer.writeString(6, _instance.content);
    }
    if (_instance.title) {
      _writer.writeString(8, _instance.title);
    }
    if (_instance.changeId) {
      _writer.writeUint64String(9, _instance.changeId);
    }
    if (_instance.sheets && _instance.sheets.length) {
      _writer.writeRepeatedMessage(
        10,
        _instance.sheets as any,
        SheetEntity.serializeBinaryToWriter
      );
    }
  }

  private _id: number;
  private _uid: string;
  private _color: string;
  private _createdDate: string;
  private _lastEditing: string;
  private _content: string;
  private _title: string;
  private _changeId: string;
  private _sheets?: SheetEntity[];

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of OpenDocResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<OpenDocResponse.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.uid = _value.uid;
    this.color = _value.color;
    this.createdDate = _value.createdDate;
    this.lastEditing = _value.lastEditing;
    this.content = _value.content;
    this.title = _value.title;
    this.changeId = _value.changeId;
    this.sheets = (_value.sheets || []).map(m => new SheetEntity(m));
    OpenDocResponse.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get uid(): string {
    return this._uid;
  }
  set uid(value: string) {
    this._uid = value;
  }
  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
  }
  get createdDate(): string {
    return this._createdDate;
  }
  set createdDate(value: string) {
    this._createdDate = value;
  }
  get lastEditing(): string {
    return this._lastEditing;
  }
  set lastEditing(value: string) {
    this._lastEditing = value;
  }
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    this._content = value;
  }
  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }
  get changeId(): string {
    return this._changeId;
  }
  set changeId(value: string) {
    this._changeId = value;
  }
  get sheets(): SheetEntity[] | undefined {
    return this._sheets;
  }
  set sheets(value: SheetEntity[] | undefined) {
    this._sheets = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    OpenDocResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): OpenDocResponse.AsObject {
    return {
      id: this.id,
      uid: this.uid,
      color: this.color,
      createdDate: this.createdDate,
      lastEditing: this.lastEditing,
      content: this.content,
      title: this.title,
      changeId: this.changeId,
      sheets: (this.sheets || []).map(m => m.toObject())
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): OpenDocResponse.AsProtobufJSON {
    return {
      id: this.id,
      uid: this.uid,
      color: this.color,
      createdDate: this.createdDate,
      lastEditing: this.lastEditing,
      content: this.content,
      title: this.title,
      changeId: this.changeId,
      sheets: (this.sheets || []).map(m => m.toProtobufJSON(options))
    };
  }
}
export module OpenDocResponse {
  /**
   * Standard JavaScript object representation for OpenDocResponse
   */
  export interface AsObject {
    id: number;
    uid: string;
    color: string;
    createdDate: string;
    lastEditing: string;
    content: string;
    title: string;
    changeId: string;
    sheets?: SheetEntity.AsObject[];
  }

  /**
   * Protobuf JSON representation for OpenDocResponse
   */
  export interface AsProtobufJSON {
    id: number;
    uid: string;
    color: string;
    createdDate: string;
    lastEditing: string;
    content: string;
    title: string;
    changeId: string;
    sheets: SheetEntity.AsProtobufJSON[] | null;
  }
}

/**
 * Message implementation for docs.SheetEntity
 */
export class SheetEntity implements GrpcMessage {
  static id = 'docs.SheetEntity';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new SheetEntity();
    SheetEntity.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: SheetEntity) {
    _instance.id = _instance.id || 0;
    _instance.uid = _instance.uid || '';
    _instance.color = _instance.color || '';
    _instance.createdDate = _instance.createdDate || '';
    _instance.lastEditing = _instance.lastEditing || '';
    _instance.projectId = _instance.projectId || 0;
    _instance.createdById = _instance.createdById || '';
    _instance.title = _instance.title || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: SheetEntity,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.uid = _reader.readString();
          break;
        case 3:
          _instance.color = _reader.readString();
          break;
        case 4:
          _instance.createdDate = _reader.readString();
          break;
        case 5:
          _instance.lastEditing = _reader.readString();
          break;
        case 6:
          _instance.projectId = _reader.readInt32();
          break;
        case 8:
          _instance.createdById = _reader.readString();
          break;
        case 10:
          _instance.title = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    SheetEntity.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: SheetEntity,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.uid) {
      _writer.writeString(2, _instance.uid);
    }
    if (_instance.color) {
      _writer.writeString(3, _instance.color);
    }
    if (_instance.createdDate) {
      _writer.writeString(4, _instance.createdDate);
    }
    if (_instance.lastEditing) {
      _writer.writeString(5, _instance.lastEditing);
    }
    if (_instance.projectId) {
      _writer.writeInt32(6, _instance.projectId);
    }
    if (_instance.createdById) {
      _writer.writeString(8, _instance.createdById);
    }
    if (_instance.title) {
      _writer.writeString(10, _instance.title);
    }
  }

  private _id: number;
  private _uid: string;
  private _color: string;
  private _createdDate: string;
  private _lastEditing: string;
  private _projectId: number;
  private _createdById: string;
  private _title: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of SheetEntity to deeply clone from
   */
  constructor(_value?: RecursivePartial<SheetEntity.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.uid = _value.uid;
    this.color = _value.color;
    this.createdDate = _value.createdDate;
    this.lastEditing = _value.lastEditing;
    this.projectId = _value.projectId;
    this.createdById = _value.createdById;
    this.title = _value.title;
    SheetEntity.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get uid(): string {
    return this._uid;
  }
  set uid(value: string) {
    this._uid = value;
  }
  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
  }
  get createdDate(): string {
    return this._createdDate;
  }
  set createdDate(value: string) {
    this._createdDate = value;
  }
  get lastEditing(): string {
    return this._lastEditing;
  }
  set lastEditing(value: string) {
    this._lastEditing = value;
  }
  get projectId(): number {
    return this._projectId;
  }
  set projectId(value: number) {
    this._projectId = value;
  }
  get createdById(): string {
    return this._createdById;
  }
  set createdById(value: string) {
    this._createdById = value;
  }
  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    SheetEntity.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): SheetEntity.AsObject {
    return {
      id: this.id,
      uid: this.uid,
      color: this.color,
      createdDate: this.createdDate,
      lastEditing: this.lastEditing,
      projectId: this.projectId,
      createdById: this.createdById,
      title: this.title
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): SheetEntity.AsProtobufJSON {
    return {
      id: this.id,
      uid: this.uid,
      color: this.color,
      createdDate: this.createdDate,
      lastEditing: this.lastEditing,
      projectId: this.projectId,
      createdById: this.createdById,
      title: this.title
    };
  }
}
export module SheetEntity {
  /**
   * Standard JavaScript object representation for SheetEntity
   */
  export interface AsObject {
    id: number;
    uid: string;
    color: string;
    createdDate: string;
    lastEditing: string;
    projectId: number;
    createdById: string;
    title: string;
  }

  /**
   * Protobuf JSON representation for SheetEntity
   */
  export interface AsProtobufJSON {
    id: number;
    uid: string;
    color: string;
    createdDate: string;
    lastEditing: string;
    projectId: number;
    createdById: string;
    title: string;
  }
}

/**
 * Message implementation for docs.DocIdentityRequest
 */
export class DocIdentityRequest implements GrpcMessage {
  static id = 'docs.DocIdentityRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocIdentityRequest();
    DocIdentityRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocIdentityRequest) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
    _instance.sessionId = _instance.sessionId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocIdentityRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.userId = _reader.readString();
          break;
        case 3:
          _instance.sessionId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    DocIdentityRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocIdentityRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(2, _instance.userId);
    }
    if (_instance.sessionId) {
      _writer.writeInt64String(3, _instance.sessionId);
    }
  }

  private _id: number;
  private _userId: string;
  private _sessionId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocIdentityRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocIdentityRequest.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    this.sessionId = _value.sessionId;
    DocIdentityRequest.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocIdentityRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocIdentityRequest.AsObject {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocIdentityRequest.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }
}
export module DocIdentityRequest {
  /**
   * Standard JavaScript object representation for DocIdentityRequest
   */
  export interface AsObject {
    id: number;
    userId: string;
    sessionId: string;
  }

  /**
   * Protobuf JSON representation for DocIdentityRequest
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
    sessionId: string;
  }
}

/**
 * Message implementation for docs.DocWriteRequest
 */
export class DocWriteRequest implements GrpcMessage {
  static id = 'docs.DocWriteRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocWriteRequest();
    DocWriteRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocWriteRequest) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
    _instance.sessionId = _instance.sessionId || '0';
    _instance.changeId = _instance.changeId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocWriteRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.userId = _reader.readString();
          break;
        case 6:
          _instance.sessionId = _reader.readInt64String();
          break;
        case 7:
          _instance.changeId = _reader.readUint64String();
          break;
        case 3:
          _instance.insert = new Insert();
          _reader.readMessage(
            _instance.insert,
            Insert.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.remove = new Remove();
          _reader.readMessage(
            _instance.remove,
            Remove.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.replace = new Replace();
          _reader.readMessage(
            _instance.replace,
            Replace.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    DocWriteRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocWriteRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(2, _instance.userId);
    }
    if (_instance.sessionId) {
      _writer.writeInt64String(6, _instance.sessionId);
    }
    if (_instance.changeId) {
      _writer.writeUint64String(7, _instance.changeId);
    }
    if (_instance.insert) {
      _writer.writeMessage(
        3,
        _instance.insert as any,
        Insert.serializeBinaryToWriter
      );
    }
    if (_instance.remove) {
      _writer.writeMessage(
        4,
        _instance.remove as any,
        Remove.serializeBinaryToWriter
      );
    }
    if (_instance.replace) {
      _writer.writeMessage(
        5,
        _instance.replace as any,
        Replace.serializeBinaryToWriter
      );
    }
  }

  private _id: number;
  private _userId: string;
  private _sessionId: string;
  private _changeId: string;
  private _insert?: Insert;
  private _remove?: Remove;
  private _replace?: Replace;

  private _change: DocWriteRequest.ChangeCase = DocWriteRequest.ChangeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocWriteRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocWriteRequest.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    this.sessionId = _value.sessionId;
    this.changeId = _value.changeId;
    this.insert = _value.insert ? new Insert(_value.insert) : undefined;
    this.remove = _value.remove ? new Remove(_value.remove) : undefined;
    this.replace = _value.replace ? new Replace(_value.replace) : undefined;
    DocWriteRequest.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }
  get changeId(): string {
    return this._changeId;
  }
  set changeId(value: string) {
    this._changeId = value;
  }
  get insert(): Insert | undefined {
    return this._insert;
  }
  set insert(value: Insert | undefined) {
    if (value !== undefined && value !== null) {
      this._remove = this._replace = undefined;
      this._change = DocWriteRequest.ChangeCase.insert;
    }
    this._insert = value;
  }
  get remove(): Remove | undefined {
    return this._remove;
  }
  set remove(value: Remove | undefined) {
    if (value !== undefined && value !== null) {
      this._insert = this._replace = undefined;
      this._change = DocWriteRequest.ChangeCase.remove;
    }
    this._remove = value;
  }
  get replace(): Replace | undefined {
    return this._replace;
  }
  set replace(value: Replace | undefined) {
    if (value !== undefined && value !== null) {
      this._insert = this._remove = undefined;
      this._change = DocWriteRequest.ChangeCase.replace;
    }
    this._replace = value;
  }
  get change() {
    return this._change;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocWriteRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocWriteRequest.AsObject {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId,
      changeId: this.changeId,
      insert: this.insert ? this.insert.toObject() : undefined,
      remove: this.remove ? this.remove.toObject() : undefined,
      replace: this.replace ? this.replace.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocWriteRequest.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId,
      sessionId: this.sessionId,
      changeId: this.changeId,
      insert: this.insert ? this.insert.toProtobufJSON(options) : null,
      remove: this.remove ? this.remove.toProtobufJSON(options) : null,
      replace: this.replace ? this.replace.toProtobufJSON(options) : null
    };
  }
}
export module DocWriteRequest {
  /**
   * Standard JavaScript object representation for DocWriteRequest
   */
  export interface AsObject {
    id: number;
    userId: string;
    sessionId: string;
    changeId: string;
    insert?: Insert.AsObject;
    remove?: Remove.AsObject;
    replace?: Replace.AsObject;
  }

  /**
   * Protobuf JSON representation for DocWriteRequest
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
    sessionId: string;
    changeId: string;
    insert: Insert.AsProtobufJSON | null;
    remove: Remove.AsProtobufJSON | null;
    replace: Replace.AsProtobufJSON | null;
  }
  export enum ChangeCase {
    none = 0,
    insert = 1,
    remove = 2,
    replace = 3
  }
}

/**
 * Message implementation for docs.CRCCheckRequest
 */
export class CRCCheckRequest implements GrpcMessage {
  static id = 'docs.CRCCheckRequest';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CRCCheckRequest();
    CRCCheckRequest.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CRCCheckRequest) {
    _instance.id = _instance.id || 0;
    _instance.crc = _instance.crc || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CRCCheckRequest,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.crc = _reader.readUint32();
          break;
        default:
          _reader.skipField();
      }
    }

    CRCCheckRequest.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CRCCheckRequest,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.crc) {
      _writer.writeUint32(2, _instance.crc);
    }
  }

  private _id: number;
  private _crc: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CRCCheckRequest to deeply clone from
   */
  constructor(_value?: RecursivePartial<CRCCheckRequest.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.crc = _value.crc;
    CRCCheckRequest.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get crc(): number {
    return this._crc;
  }
  set crc(value: number) {
    this._crc = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CRCCheckRequest.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CRCCheckRequest.AsObject {
    return {
      id: this.id,
      crc: this.crc
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): CRCCheckRequest.AsProtobufJSON {
    return {
      id: this.id,
      crc: this.crc
    };
  }
}
export module CRCCheckRequest {
  /**
   * Standard JavaScript object representation for CRCCheckRequest
   */
  export interface AsObject {
    id: number;
    crc: number;
  }

  /**
   * Protobuf JSON representation for CRCCheckRequest
   */
  export interface AsProtobufJSON {
    id: number;
    crc: number;
  }
}

/**
 * Message implementation for docs.CRCCheckResponse
 */
export class CRCCheckResponse implements GrpcMessage {
  static id = 'docs.CRCCheckResponse';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new CRCCheckResponse();
    CRCCheckResponse.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: CRCCheckResponse) {
    _instance.valid = _instance.valid || false;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: CRCCheckResponse,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.valid = _reader.readBool();
          break;
        default:
          _reader.skipField();
      }
    }

    CRCCheckResponse.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: CRCCheckResponse,
    _writer: BinaryWriter
  ) {
    if (_instance.valid) {
      _writer.writeBool(1, _instance.valid);
    }
  }

  private _valid: boolean;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of CRCCheckResponse to deeply clone from
   */
  constructor(_value?: RecursivePartial<CRCCheckResponse.AsObject>) {
    _value = _value || {};
    this.valid = _value.valid;
    CRCCheckResponse.refineValues(this);
  }
  get valid(): boolean {
    return this._valid;
  }
  set valid(value: boolean) {
    this._valid = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    CRCCheckResponse.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): CRCCheckResponse.AsObject {
    return {
      valid: this.valid
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): CRCCheckResponse.AsProtobufJSON {
    return {
      valid: this.valid
    };
  }
}
export module CRCCheckResponse {
  /**
   * Standard JavaScript object representation for CRCCheckResponse
   */
  export interface AsObject {
    valid: boolean;
  }

  /**
   * Protobuf JSON representation for CRCCheckResponse
   */
  export interface AsProtobufJSON {
    valid: boolean;
  }
}

/**
 * Message implementation for docs.DocEvent
 */
export class DocEvent implements GrpcMessage {
  static id = 'docs.DocEvent';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEvent();
    DocEvent.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEvent) {}

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEvent,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.open = new DocEventOpen();
          _reader.readMessage(
            _instance.open,
            DocEventOpen.deserializeBinaryFromReader
          );
          break;
        case 2:
          _instance.close = new DocEventClose();
          _reader.readMessage(
            _instance.close,
            DocEventClose.deserializeBinaryFromReader
          );
          break;
        case 3:
          _instance.write = new DocEventWrite();
          _reader.readMessage(
            _instance.write,
            DocEventWrite.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.remove = new DocEventRemove();
          _reader.readMessage(
            _instance.remove,
            DocEventRemove.deserializeBinaryFromReader
          );
          break;
        case 6:
          _instance.subscribed = new DocEventSubscribed();
          _reader.readMessage(
            _instance.subscribed,
            DocEventSubscribed.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    DocEvent.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(_instance: DocEvent, _writer: BinaryWriter) {
    if (_instance.open) {
      _writer.writeMessage(
        1,
        _instance.open as any,
        DocEventOpen.serializeBinaryToWriter
      );
    }
    if (_instance.close) {
      _writer.writeMessage(
        2,
        _instance.close as any,
        DocEventClose.serializeBinaryToWriter
      );
    }
    if (_instance.write) {
      _writer.writeMessage(
        3,
        _instance.write as any,
        DocEventWrite.serializeBinaryToWriter
      );
    }
    if (_instance.remove) {
      _writer.writeMessage(
        5,
        _instance.remove as any,
        DocEventRemove.serializeBinaryToWriter
      );
    }
    if (_instance.subscribed) {
      _writer.writeMessage(
        6,
        _instance.subscribed as any,
        DocEventSubscribed.serializeBinaryToWriter
      );
    }
  }

  private _open?: DocEventOpen;
  private _close?: DocEventClose;
  private _write?: DocEventWrite;
  private _remove?: DocEventRemove;
  private _subscribed?: DocEventSubscribed;

  private _event: DocEvent.EventCase = DocEvent.EventCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEvent to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEvent.AsObject>) {
    _value = _value || {};
    this.open = _value.open ? new DocEventOpen(_value.open) : undefined;
    this.close = _value.close ? new DocEventClose(_value.close) : undefined;
    this.write = _value.write ? new DocEventWrite(_value.write) : undefined;
    this.remove = _value.remove ? new DocEventRemove(_value.remove) : undefined;
    this.subscribed = _value.subscribed
      ? new DocEventSubscribed(_value.subscribed)
      : undefined;
    DocEvent.refineValues(this);
  }
  get open(): DocEventOpen | undefined {
    return this._open;
  }
  set open(value: DocEventOpen | undefined) {
    if (value !== undefined && value !== null) {
      this._close = this._write = this._remove = this._subscribed = undefined;
      this._event = DocEvent.EventCase.open;
    }
    this._open = value;
  }
  get close(): DocEventClose | undefined {
    return this._close;
  }
  set close(value: DocEventClose | undefined) {
    if (value !== undefined && value !== null) {
      this._open = this._write = this._remove = this._subscribed = undefined;
      this._event = DocEvent.EventCase.close;
    }
    this._close = value;
  }
  get write(): DocEventWrite | undefined {
    return this._write;
  }
  set write(value: DocEventWrite | undefined) {
    if (value !== undefined && value !== null) {
      this._open = this._close = this._remove = this._subscribed = undefined;
      this._event = DocEvent.EventCase.write;
    }
    this._write = value;
  }
  get remove(): DocEventRemove | undefined {
    return this._remove;
  }
  set remove(value: DocEventRemove | undefined) {
    if (value !== undefined && value !== null) {
      this._open = this._close = this._write = this._subscribed = undefined;
      this._event = DocEvent.EventCase.remove;
    }
    this._remove = value;
  }
  get subscribed(): DocEventSubscribed | undefined {
    return this._subscribed;
  }
  set subscribed(value: DocEventSubscribed | undefined) {
    if (value !== undefined && value !== null) {
      this._open = this._close = this._write = this._remove = undefined;
      this._event = DocEvent.EventCase.subscribed;
    }
    this._subscribed = value;
  }
  get event() {
    return this._event;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEvent.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEvent.AsObject {
    return {
      open: this.open ? this.open.toObject() : undefined,
      close: this.close ? this.close.toObject() : undefined,
      write: this.write ? this.write.toObject() : undefined,
      remove: this.remove ? this.remove.toObject() : undefined,
      subscribed: this.subscribed ? this.subscribed.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEvent.AsProtobufJSON {
    return {
      open: this.open ? this.open.toProtobufJSON(options) : null,
      close: this.close ? this.close.toProtobufJSON(options) : null,
      write: this.write ? this.write.toProtobufJSON(options) : null,
      remove: this.remove ? this.remove.toProtobufJSON(options) : null,
      subscribed: this.subscribed
        ? this.subscribed.toProtobufJSON(options)
        : null
    };
  }
}
export module DocEvent {
  /**
   * Standard JavaScript object representation for DocEvent
   */
  export interface AsObject {
    open?: DocEventOpen.AsObject;
    close?: DocEventClose.AsObject;
    write?: DocEventWrite.AsObject;
    remove?: DocEventRemove.AsObject;
    subscribed?: DocEventSubscribed.AsObject;
  }

  /**
   * Protobuf JSON representation for DocEvent
   */
  export interface AsProtobufJSON {
    open: DocEventOpen.AsProtobufJSON | null;
    close: DocEventClose.AsProtobufJSON | null;
    write: DocEventWrite.AsProtobufJSON | null;
    remove: DocEventRemove.AsProtobufJSON | null;
    subscribed: DocEventSubscribed.AsProtobufJSON | null;
  }
  export enum EventCase {
    none = 0,
    open = 1,
    close = 2,
    write = 3,
    remove = 4,
    subscribed = 5
  }
}

/**
 * Message implementation for docs.DocEventSubscribed
 */
export class DocEventSubscribed implements GrpcMessage {
  static id = 'docs.DocEventSubscribed';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEventSubscribed();
    DocEventSubscribed.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEventSubscribed) {
    _instance.id = _instance.id || 0;
    _instance.sessionId = _instance.sessionId || '0';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEventSubscribed,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.sessionId = _reader.readInt64String();
          break;
        default:
          _reader.skipField();
      }
    }

    DocEventSubscribed.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocEventSubscribed,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.sessionId) {
      _writer.writeInt64String(2, _instance.sessionId);
    }
  }

  private _id: number;
  private _sessionId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEventSubscribed to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEventSubscribed.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.sessionId = _value.sessionId;
    DocEventSubscribed.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get sessionId(): string {
    return this._sessionId;
  }
  set sessionId(value: string) {
    this._sessionId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEventSubscribed.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEventSubscribed.AsObject {
    return {
      id: this.id,
      sessionId: this.sessionId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEventSubscribed.AsProtobufJSON {
    return {
      id: this.id,
      sessionId: this.sessionId
    };
  }
}
export module DocEventSubscribed {
  /**
   * Standard JavaScript object representation for DocEventSubscribed
   */
  export interface AsObject {
    id: number;
    sessionId: string;
  }

  /**
   * Protobuf JSON representation for DocEventSubscribed
   */
  export interface AsProtobufJSON {
    id: number;
    sessionId: string;
  }
}

/**
 * Message implementation for docs.DocEventOpen
 */
export class DocEventOpen implements GrpcMessage {
  static id = 'docs.DocEventOpen';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEventOpen();
    DocEventOpen.deserializeBinaryFromReader(instance, new BinaryReader(bytes));
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEventOpen) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
    _instance.userName = _instance.userName || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEventOpen,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 2:
          _instance.id = _reader.readInt32();
          break;
        case 3:
          _instance.userId = _reader.readString();
          break;
        case 4:
          _instance.userName = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DocEventOpen.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocEventOpen,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(2, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(3, _instance.userId);
    }
    if (_instance.userName) {
      _writer.writeString(4, _instance.userName);
    }
  }

  private _id: number;
  private _userId: string;
  private _userName: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEventOpen to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEventOpen.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    this.userName = _value.userName;
    DocEventOpen.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }
  get userName(): string {
    return this._userName;
  }
  set userName(value: string) {
    this._userName = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEventOpen.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEventOpen.AsObject {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEventOpen.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId,
      userName: this.userName
    };
  }
}
export module DocEventOpen {
  /**
   * Standard JavaScript object representation for DocEventOpen
   */
  export interface AsObject {
    id: number;
    userId: string;
    userName: string;
  }

  /**
   * Protobuf JSON representation for DocEventOpen
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
    userName: string;
  }
}

/**
 * Message implementation for docs.DocEventClose
 */
export class DocEventClose implements GrpcMessage {
  static id = 'docs.DocEventClose';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEventClose();
    DocEventClose.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEventClose) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEventClose,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.userId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DocEventClose.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocEventClose,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(2, _instance.userId);
    }
  }

  private _id: number;
  private _userId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEventClose to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEventClose.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    DocEventClose.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEventClose.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEventClose.AsObject {
    return {
      id: this.id,
      userId: this.userId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEventClose.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId
    };
  }
}
export module DocEventClose {
  /**
   * Standard JavaScript object representation for DocEventClose
   */
  export interface AsObject {
    id: number;
    userId: string;
  }

  /**
   * Protobuf JSON representation for DocEventClose
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
  }
}

/**
 * Message implementation for docs.DocEventWrite
 */
export class DocEventWrite implements GrpcMessage {
  static id = 'docs.DocEventWrite';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEventWrite();
    DocEventWrite.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEventWrite) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEventWrite,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.userId = _reader.readString();
          break;
        case 3:
          _instance.insert = new Insert();
          _reader.readMessage(
            _instance.insert,
            Insert.deserializeBinaryFromReader
          );
          break;
        case 4:
          _instance.remove = new Remove();
          _reader.readMessage(
            _instance.remove,
            Remove.deserializeBinaryFromReader
          );
          break;
        case 5:
          _instance.replace = new Replace();
          _reader.readMessage(
            _instance.replace,
            Replace.deserializeBinaryFromReader
          );
          break;
        default:
          _reader.skipField();
      }
    }

    DocEventWrite.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocEventWrite,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(2, _instance.userId);
    }
    if (_instance.insert) {
      _writer.writeMessage(
        3,
        _instance.insert as any,
        Insert.serializeBinaryToWriter
      );
    }
    if (_instance.remove) {
      _writer.writeMessage(
        4,
        _instance.remove as any,
        Remove.serializeBinaryToWriter
      );
    }
    if (_instance.replace) {
      _writer.writeMessage(
        5,
        _instance.replace as any,
        Replace.serializeBinaryToWriter
      );
    }
  }

  private _id: number;
  private _userId: string;
  private _insert?: Insert;
  private _remove?: Remove;
  private _replace?: Replace;

  private _change: DocEventWrite.ChangeCase = DocEventWrite.ChangeCase.none;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEventWrite to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEventWrite.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    this.insert = _value.insert ? new Insert(_value.insert) : undefined;
    this.remove = _value.remove ? new Remove(_value.remove) : undefined;
    this.replace = _value.replace ? new Replace(_value.replace) : undefined;
    DocEventWrite.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }
  get insert(): Insert | undefined {
    return this._insert;
  }
  set insert(value: Insert | undefined) {
    if (value !== undefined && value !== null) {
      this._remove = this._replace = undefined;
      this._change = DocEventWrite.ChangeCase.insert;
    }
    this._insert = value;
  }
  get remove(): Remove | undefined {
    return this._remove;
  }
  set remove(value: Remove | undefined) {
    if (value !== undefined && value !== null) {
      this._insert = this._replace = undefined;
      this._change = DocEventWrite.ChangeCase.remove;
    }
    this._remove = value;
  }
  get replace(): Replace | undefined {
    return this._replace;
  }
  set replace(value: Replace | undefined) {
    if (value !== undefined && value !== null) {
      this._insert = this._remove = undefined;
      this._change = DocEventWrite.ChangeCase.replace;
    }
    this._replace = value;
  }
  get change() {
    return this._change;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEventWrite.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEventWrite.AsObject {
    return {
      id: this.id,
      userId: this.userId,
      insert: this.insert ? this.insert.toObject() : undefined,
      remove: this.remove ? this.remove.toObject() : undefined,
      replace: this.replace ? this.replace.toObject() : undefined
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEventWrite.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId,
      insert: this.insert ? this.insert.toProtobufJSON(options) : null,
      remove: this.remove ? this.remove.toProtobufJSON(options) : null,
      replace: this.replace ? this.replace.toProtobufJSON(options) : null
    };
  }
}
export module DocEventWrite {
  /**
   * Standard JavaScript object representation for DocEventWrite
   */
  export interface AsObject {
    id: number;
    userId: string;
    insert?: Insert.AsObject;
    remove?: Remove.AsObject;
    replace?: Replace.AsObject;
  }

  /**
   * Protobuf JSON representation for DocEventWrite
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
    insert: Insert.AsProtobufJSON | null;
    remove: Remove.AsProtobufJSON | null;
    replace: Replace.AsProtobufJSON | null;
  }
  export enum ChangeCase {
    none = 0,
    insert = 1,
    remove = 2,
    replace = 3
  }
}

/**
 * Message implementation for docs.DocEventCursor
 */
export class DocEventCursor implements GrpcMessage {
  static id = 'docs.DocEventCursor';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEventCursor();
    DocEventCursor.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEventCursor) {
    _instance.offset = _instance.offset || 0;
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEventCursor,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 2:
          _instance.offset = _reader.readInt32();
          break;
        default:
          _reader.skipField();
      }
    }

    DocEventCursor.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocEventCursor,
    _writer: BinaryWriter
  ) {
    if (_instance.offset) {
      _writer.writeInt32(2, _instance.offset);
    }
  }

  private _offset: number;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEventCursor to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEventCursor.AsObject>) {
    _value = _value || {};
    this.offset = _value.offset;
    DocEventCursor.refineValues(this);
  }
  get offset(): number {
    return this._offset;
  }
  set offset(value: number) {
    this._offset = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEventCursor.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEventCursor.AsObject {
    return {
      offset: this.offset
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEventCursor.AsProtobufJSON {
    return {
      offset: this.offset
    };
  }
}
export module DocEventCursor {
  /**
   * Standard JavaScript object representation for DocEventCursor
   */
  export interface AsObject {
    offset: number;
  }

  /**
   * Protobuf JSON representation for DocEventCursor
   */
  export interface AsProtobufJSON {
    offset: number;
  }
}

/**
 * Message implementation for docs.DocEventRemove
 */
export class DocEventRemove implements GrpcMessage {
  static id = 'docs.DocEventRemove';

  /**
   * Deserialize binary data to message
   * @param instance message instance
   */
  static deserializeBinary(bytes: ByteSource) {
    const instance = new DocEventRemove();
    DocEventRemove.deserializeBinaryFromReader(
      instance,
      new BinaryReader(bytes)
    );
    return instance;
  }

  /**
   * Check all the properties and set default protobuf values if necessary
   * @param _instance message instance
   */
  static refineValues(_instance: DocEventRemove) {
    _instance.id = _instance.id || 0;
    _instance.userId = _instance.userId || '';
  }

  /**
   * Deserializes / reads binary message into message instance using provided binary reader
   * @param _instance message instance
   * @param _reader binary reader instance
   */
  static deserializeBinaryFromReader(
    _instance: DocEventRemove,
    _reader: BinaryReader
  ) {
    while (_reader.nextField()) {
      if (_reader.isEndGroup()) break;

      switch (_reader.getFieldNumber()) {
        case 1:
          _instance.id = _reader.readInt32();
          break;
        case 2:
          _instance.userId = _reader.readString();
          break;
        default:
          _reader.skipField();
      }
    }

    DocEventRemove.refineValues(_instance);
  }

  /**
   * Serializes a message to binary format using provided binary reader
   * @param _instance message instance
   * @param _writer binary writer instance
   */
  static serializeBinaryToWriter(
    _instance: DocEventRemove,
    _writer: BinaryWriter
  ) {
    if (_instance.id) {
      _writer.writeInt32(1, _instance.id);
    }
    if (_instance.userId) {
      _writer.writeString(2, _instance.userId);
    }
  }

  private _id: number;
  private _userId: string;

  /**
   * Message constructor. Initializes the properties and applies default Protobuf values if necessary
   * @param _value initial values object or instance of DocEventRemove to deeply clone from
   */
  constructor(_value?: RecursivePartial<DocEventRemove.AsObject>) {
    _value = _value || {};
    this.id = _value.id;
    this.userId = _value.userId;
    DocEventRemove.refineValues(this);
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(value: string) {
    this._userId = value;
  }

  /**
   * Serialize message to binary data
   * @param instance message instance
   */
  serializeBinary() {
    const writer = new BinaryWriter();
    DocEventRemove.serializeBinaryToWriter(this, writer);
    return writer.getResultBuffer();
  }

  /**
   * Cast message to standard JavaScript object (all non-primitive values are deeply cloned)
   */
  toObject(): DocEventRemove.AsObject {
    return {
      id: this.id,
      userId: this.userId
    };
  }

  /**
   * Convenience method to support JSON.stringify(message), replicates the structure of toObject()
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Cast message to JSON using protobuf JSON notation: https://developers.google.com/protocol-buffers/docs/proto3#json
   * Attention: output differs from toObject() e.g. enums are represented as names and not as numbers, Timestamp is an ISO Date string format etc.
   * If the message itself or some of descendant messages is google.protobuf.Any, you MUST provide a message pool as options. If not, the messagePool is not required
   */
  toProtobufJSON(
    // @ts-ignore
    options?: ToProtobufJSONOptions
  ): DocEventRemove.AsProtobufJSON {
    return {
      id: this.id,
      userId: this.userId
    };
  }
}
export module DocEventRemove {
  /**
   * Standard JavaScript object representation for DocEventRemove
   */
  export interface AsObject {
    id: number;
    userId: string;
  }

  /**
   * Protobuf JSON representation for DocEventRemove
   */
  export interface AsProtobufJSON {
    id: number;
    userId: string;
  }
}
