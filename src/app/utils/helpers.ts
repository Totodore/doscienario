export function setImmediate(callback: (...args: any) => void, ...args: any) {
  setTimeout(callback, 0, args);
}
