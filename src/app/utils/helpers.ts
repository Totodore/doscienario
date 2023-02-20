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

/**
 * Convert hsl color representation to an hex representation
 * @returns the hex value without preceding #
 */
export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `${f(0)}${f(8)}${f(4)}`;
}


export function camelToSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, (g) => `${g[0].toLowerCase()}`);
}