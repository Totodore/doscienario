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
/**
 * Get all rels to delete
 * Get all nodes to delete (if a node has no parent relationship)
 */
export function removeNodeFromTree(id: number, nodes: number[], rels: Tuple[]): RemoveObj {
  const removeRels = nodeIterate(id, rels);
  //add parent rels of the deleted node
  removeRels.push(...rels.filter(rel => rel[1] === id).map(el => el[2]));
  const keepingRelsChildId = rels.filter(el => !removeRels.includes(el[2])).map(el => el[1]);
  //if a node has no parent relation we remove it
  const removeNodes = nodes.filter(node => !keepingRelsChildId.includes(node));
  return { rels: removeRels, nodes: removeNodes };
}
/**
 * @returns all relationships to delete
 */
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
