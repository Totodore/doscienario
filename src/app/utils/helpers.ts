import { Node } from './../models/sockets/blueprint-sock.model';
import { Relationship } from "../models/sockets/blueprint-sock.model";

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

/**
 * Autoposition a whole blueprint according to its structure
 */
export function autoposNode(nodes: Node[], rels: Relationship[], margin: Tuple) {
  let depthLevel = 0;
  const root = nodes.find(el => el.isRoot);
  // const depth = findDepth(root, rels, nodes);
  console.log(findNodesByLevel(root, rels, nodes, 1));
}

/**
 * Algorithm to find the depth of a tree
 * For each child of a node we take the child with the bigger depth and we return it
 */
function findDepth(root: Node, rels: Relationship[], nodes: Node[]): number {
  const childs = findChildNodes(root, rels, nodes);
  let childDepth = -1;
  for (const child of childs) {
    const h = findDepth(child, rels, nodes);
    console.log("root:", root, h);
    if (h > childDepth)
      childDepth = h;
  }
  return childDepth + 1;
}

function findParentNodes(node: Node, rels: Relationship[], nodes: Node[]): Node[] {
  return rels.filter(el => el.childId === node.id).map(el => nodes.find(node => node.id === el?.parentId));
}
function findChildNodes(node: Node, rels: Relationship[], nodes: Node[]): Node[] {
  return rels.filter(el => el.parentId === node.id).map(el => nodes.find(node => node.id === el?.childId));
}
/**
 * Todo: Demander à léo pour faire marcher cette merde de nodes by level
 */
function findNodesByLevel(root: Node, rels: Relationship[], nodes: Node[], level: number): Node[] {
  const childs = findChildNodes(root, rels, nodes);
  let childDepth = -1;
  for (const child of childs) {
    const h = findDepth(child, rels, nodes);
    // console.log("root:", root, h);
    if (h > childDepth)
      childDepth = h;
  }
  if (childDepth + 1 === level)
    return childs;
  else return findNodesByLevel(root, rels, nodes, level);
}
interface RemoveObj {
  nodes: number[];
  rels: number[];
}
// 0: parent, 1: child, 2: id
type Tuple = [number, number, number?];
