import { AbstractIoHandler } from './../services/sockets/abstract-handler.service';
import { Flags } from './../models/sockets/flags.enum';

export function EventHandler(event: Flags | string) {
  return function (target: AbstractIoHandler, key: any) {
    target.handlers ??= [];
    target.handlers.push([event, target[key]]);
  }
}