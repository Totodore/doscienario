export function setImmediate(callback: (...args: any) => void, ...args: any) {
  setTimeout(callback, 0, args);
}
export function sortByRelevance<T>(a: T, b: T, needle: string, accessor?: (el: T) => string): -1 | 0 | 1 {
  const aVal = accessor(a);
  const bVal = accessor(b);
  const commonAChar = aVal.split("").reduce<number>((prev, curr) => prev + (needle.split(curr).length - 1), 0);
  const commonBChar = bVal.split("").reduce<number>((prev, curr) => prev + (needle.split(curr).length - 1), 0);
  if (commonAChar > commonBChar)
    return 1;
  else if (commonBChar > commonAChar)
    return -1;
  else
    return 0;
}
