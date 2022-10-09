import { NGXLogger } from "ngx-logger";
import { SocketService } from "./socket.service";

export class AbstractIoHandler {

  public handlers: Handler[];

  constructor(
    protected readonly socket: SocketService,
    protected readonly logger: NGXLogger
  ) {
    this.socket.registerHandler(this);
  }

  public init() {
    this.logger.log(`Initializing socket ${this.handlers.length} handlers for ${this.constructor.name}`);
    for (let [event, handler] of this.handlers)
      this.socket.on(event, (...args: any[]) => handler.call(this, ...args));
  }

  public destroy() {
    for (let [event, handler] of this.handlers)
      this.socket.removeListener(event, handler);
  }
}

export type Handler = [string, () => void];
