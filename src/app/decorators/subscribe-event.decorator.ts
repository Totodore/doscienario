import { Flags } from './../models/sockets/flags.enum';
import { Socket } from "socket.io-client";

export function registerHandler(listener: any, socket: typeof Socket) {
  for (let [event, functionName] of listener.handlers) {
    let fonction: (...args: any) => void = functionName;
    socket.on(event, (...args: any[]) => fonction.call(listener, ...args));
  }
}
export function EventHandler(event: Flags | string) {
  return function (target: any, key: any) {
    if (!target.handlers)
      target.handlers = [];
    target.handlers.push([event, target[key]]);
  }
}
