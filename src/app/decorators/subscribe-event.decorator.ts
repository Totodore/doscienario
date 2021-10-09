import { Flags } from './../models/sockets/flags.enum';
import { Socket } from "socket.io-client";

export function registerHandlers(listeners: any[], socket: typeof Socket) {
  for (const listener of listeners as Listener[]) {
    for (let [event, handler] of listener.handlers)
      socket.on(event, (...args: any[]) => handler.call(listener, ...args));
  }
}
export function EventHandler(event: Flags | string) {
  return function (target: any, key: any) {
    target.handlers ??= [];
    target.handlers.push([event, target[key]]);
  }
}
interface Listener {
  handlers?: Handler[];
}
type Handler = [string, () => void];