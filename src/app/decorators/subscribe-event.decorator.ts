import { SocketService } from '../services/sockets/socket.service';
import { Flags } from './../models/sockets/flags.enum';

export function registerHandler(listener: any, socket: SocketService) {
  for (let [event, handler] of (listener as Listener).handlers)
    socket.on(event, (...args: any[]) => handler.call(listener, ...args));
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