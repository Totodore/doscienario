export function setImmediate(callback: (...args: any) => void, ...args: any) {
  setTimeout(callback, 0, args);
}
export function sortByRelevance<T>(a: T, b: T, needle: string, accessor?: (el: T) => string): -1 | 0 | 1 {
  const aVal = accessor?.(a) ?? a as unknown as string;
  const bVal = accessor?.(b) ?? b as unknown as string;
  const commonAChar = aVal.split("").reduce<number>((prev, curr) => prev + (needle.split(curr).length - 1), 0);
  const commonBChar = bVal.split("").reduce<number>((prev, curr) => prev + (needle.split(curr).length - 1), 0);
  if (commonAChar > commonBChar)
    return 1;
  else if (commonBChar > commonAChar)
    return -1;
  else
    return 0;
}
export function removeNodeFromTree(id: number, nodes: number[], rels: Tuple[]): RemoveObj {
  const removeRels = nodeIterate(id, rels);
  removeRels.push(...rels.filter(rel => rel[1] === id).map(el => el[2]));
  const removeNodes = nodes.filter(node => removeRels.map(el => rels.find(rel => rel[2] === el)[1]).includes(node));
  return { rels: removeRels, nodes: removeNodes};
}

function nodeIterate(parentId: number, rels: Tuple[]): number[] {
  const removeRels: number[] = [];
  for (const rel of rels) {
    if (rel[0] === parentId) {
      removeRels.push(rel[2], ...nodeIterate(rel[1], rels));
    }
  }
  return removeRels;
}

interface RemoveObj {
  nodes: number[];
  rels: number[];
}
// 0: parent, 1: child, 2: id
type Tuple = [number, number, number];
