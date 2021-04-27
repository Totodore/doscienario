export function setImmediate(callback: (...args: any) => void, ...args: any) {
  setTimeout(callback, 0, args);
}
/** 
 * Sort array by relevance from two items 
 */
export function sortByRelevance<T>(a: T, b: T, needle: string, accessor?: (el: T) => string): number {
  const aVal = accessor?.(a) ?? a as unknown as string;
  const bVal = accessor?.(b) ?? b as unknown as string;
  const commonAChar = aVal.split("").reduce<number>((prev, curr) => prev + (needle.split(curr).length - 1), 0);
  const commonBChar = bVal.split("").reduce<number>((prev, curr) => prev + (needle.split(curr).length - 1), 0);
  return commonAChar - commonBChar;
}