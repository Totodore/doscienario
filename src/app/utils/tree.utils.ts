import { Vector } from './../../types/global.d';
import { Node } from './../models/sockets/blueprint-sock.model';
import { Relationship } from "../models/sockets/blueprint-sock.model";

/**
 * Get all rels to delete
 * Get all nodes to delete (if a node has no parent relationship)
 */
 export function removeNodeFromTree(id: number, nodes: number[], rels: Tuple[]): RemoveObj {
  const removeRels = _nodeIterate(id, rels);
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
function _nodeIterate(parentId: number, rels: Tuple[]): number[] {
  const removeRels: number[] = [];
  for (const rel of rels) {
    if (rel[0] === parentId) {
      removeRels.push(rel[2], ..._nodeIterate(rel[1], rels));
    }
  }
  return removeRels;
}

/**
 * Algorithm to find the depth of a tree
 * For each child of a node we take the child with the bigger depth and we return it
 */
export function findDepth(root: Node, rels: Relationship[], nodes: NodeStruct): number {
  const childs = findChildNodes(root, rels, nodes);
  let childDepth = -1;
  for (const child of childs) {
    const h = findDepth(child, rels, nodes);
    if (h > childDepth)
      childDepth = h;
  }
  return childDepth + 1;
}
/** 
 * Find all the parent nodes from a node 
 */
export function findParentNodes(node: Node, rels: Relationship[], nodes: NodeStruct): Node[] {
  return findParentRels(node, rels).map(el => nodes[el.parentId]);
}
/** 
 * Find all the children nodes from a node 
 */
export function findChildNodes(node: Node, rels: Relationship[], nodes: NodeStruct): Node[] {
  return findChildRels(node, rels).map(el => nodes[el.childId]);
}
export function findChildRels(node: Node, rels: Relationship[]): Relationship[] {
  return rels.filter(el => el.parentId === node.id);
}
export function findParentRels(node: Node, rels: Relationship[]): Relationship[] {
  return rels.filter(el => el.childId === node.id);
}
/** 
 * Find all nodes from a specified level 
 */
export function findNodesByLevel(
  root: Node,
  rels: Relationship[],
  nodes: Node[],
  level: number,
  currentLevel = 0,
  customNodes: NodeLevelStruct[] = _findNodesLevels(_createCustomNode(root), rels, nodes.map(node => _createCustomNode(node)), level, currentLevel)
): Node[] {
  return customNodes.filter(node => node.levels.has(level)).map(node => node.node);
}
function _findChildNodesForLevel(node: Node, rels: Relationship[], nodes: { [key: number]: NodeLevelStruct }): NodeLevelStruct[] {
  return rels.filter(el => el.parentId === node.id).map(el => nodes[el.childId]);
}

export function _createCustomNode(node: Node): NodeLevelStruct {
  return { levels: new Set<number>(), node };
}

export function _findNodesLevels(root: NodeLevelStruct, rels: Relationship[], nodes: NodeLevelStruct[], maxLevel: number, currentLevel = 0) {
  //@ts-ignore
  const nodesById = Object.fromEntries(nodes.map(node => [node.node.id, node]));
  if (root.levels.size === 0)
    root.levels.add(currentLevel);
  
  const childs = _findChildNodesForLevel(root.node, rels, nodesById);
  for (let child of childs) {
    let keepGoing = maxLevel === -1;
    for (let level of root.levels) {
      child.levels.add(level+1);
      keepGoing ||= level+1 < maxLevel;
    }
    if(keepGoing)
      _findNodesLevels(child, rels, nodes, maxLevel);
  }
  
  return nodes;
}

export function findLevelByNode(node: Node, root: Node, nodes: Node[], rels: Relationship[]): number {
  let i = 0;
  const nodesLevelCache = _findNodesLevels(_createCustomNode(root), rels, nodes.map(node => _createCustomNode(node)), -1, 0);
  //@ts-ignore
  const nodeCache: NodeStruct = Object.fromEntries(nodes.map(el => [el.id, el]));
  for (;i < findDepth(root, rels, nodeCache); i++) {
    const els = findNodesByLevel(root, rels, nodes, i, 0, nodesLevelCache);
    if (els.includes(node))
      break;
  }
  return i;
}
// function findBestOrder(nodes: Node[], rels: Relationship[], o: Tuple, margin: Tuple) {
//   const usedStates: number[][] = Array(nodes.length);
//   const rest: number[] = nodes.map(el => el.id);  //Queue
//   const construction: number[] = Array(nodes.length); //Queue
//   let minDist = Infinity;
//   let bestOrder: number[] = Array(nodes.length);
//   let actualDist = 0;

//   while (true) {
//     if (rest.length > 0) {  //Si le reste n'est pas vide et que construction n'est plein
//       if (usedStates[construction.length].length == nodes.length - construction.length) { 
//         if (construction.length == 1)
//           break;
//         usedStates[construction.length] = [];
//         rest.push(construction.pop());
//       } else if (usedStates[construction.length].includes(rest[0])) {
//         rest.push(rest.shift());
//       }
//       else {
//         const previousEl = construction[construction.length - 1];
//         const lastEl = rest.shift();
//         usedStates[construction.length].push(lastEl);
//         construction.push(lastEl);
//         actualDist += getParentRelDistance(nodes.find(el => el.id == lastEl), o, margin, rels, nodes.find(el => el.id == previousEl));
//       }
//     }
//     else {
//       usedStates.push([]);
//       rest.push(construction.pop());
//       // minDist = actualDist;
//       // actualDist = 0;
//       // bestOrder = cons;
//     }
//   }
// }


interface RemoveObj {
  nodes: number[];
  rels: number[];
}
// 0: parent, 1: child, 2: id
type Tuple = [number, number, number?];
export type NodeStruct = { [id: number]: Node };
export type RelationshipStruct = { [id: number]: Relationship };
type NodeLevelStruct = { levels: Set<number>, node: Node };