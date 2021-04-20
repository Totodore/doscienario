import { NodeStruct } from './../utils/tree.utils';
import { findChildRels, findDepth, findNodesByLevel, findParentRels, _findNodesLevels, _createCustomNode } from '../utils/tree.utils';
import { Vector } from './../../types/global.d';
import { Node, Relationship } from './../models/sockets/blueprint-sock.model';

/// <reference lib="webworker" />

addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  // postMessage(response);
  if (e.data[0].startsWith("autopos")) {
    try {
      //@ts-ignore
      postMessage([e.data[0], autoPosBlueprint(...e.data[1])]); 
    } catch (error) {
      console.error(error);
      //@ts-ignore
      postMessage([e.data[0]]);
    }
  }
});

type RelationshipCache = { [key: number]: Relationship[] };

function autoPosBlueprint(nodes: Node[], rels: Relationship[], margin: Vector): [Node[], Relationship[]] {
  //@ts-ignore
  const nodesData: NodeStruct = Object.fromEntries(nodes.map(el => [el.id, el]));
  const root = nodes.find(el => el.isRoot);
  //We get the depth of the blueprint
  const depth = findDepth(root, rels, nodesData);

  const nodesLevelCache = _findNodesLevels(_createCustomNode(root), rels, nodes.map(node => _createCustomNode(node)), -1, 0);
  //@ts-ignore
  const childCache: RelationshipCache = Object.fromEntries(nodes.map(node => [node.id, []]));
  //@ts-ignore
  const parentCache: RelationshipCache = Object.fromEntries(nodes.map(node => [node.id, []]));
  for (let rel of rels) {
    childCache[rel.parentId].push(rel);
    parentCache[rel.childId].push(rel);
  }

  //Foreach level we get all the nodes and their parents
  for (let i = 1; i < depth + 1; i++) {
    let els = findNodesByLevel(root, rels, nodes, i, 0, nodesLevelCache);
    const parents = i > 1 ? findNodesByLevel(root, rels, nodes, i - 1, 0, nodesLevelCache) : [root];

    //We compute an horizontal origin from the max right pos of the parents + the margin
    const ox = parents.reduce((prev, curr) => prev > curr.width + curr.x ? prev : curr.width + curr.x, 0) + margin[0];
    //We compute a vertical origin from the height of all the sibligs + this margin
    const oy = - (els.reduce((prev, curr) => prev + curr.height + margin[1], 0) / 2) + margin[1];

    //We clones the nodes and the rels to make a simulation
    const clonedNodes: Node[] = Object.create(els);
    const clonedRels: Relationship[] = Object.create(rels);
    let bestPermutation: number[], bestDistance: number = Infinity;

    //@ts-ignore
    const clonedNodesById: NodeStruct = Object.fromEntries(clonedNodes.map(node => [node.id, node]));
    
    //We simulate all the permutation to find the best one
    for (const permutation of permute(clonedNodes.map(el => el.id))) {
      //For each cloned siblings
      let distance = 0;
      for (let k = 0; k < permutation.length; k++) {
        distance += getParentRelDistance(clonedNodesById[permutation[k]], [ox, oy], margin, childCache, parentCache, clonedNodesById[permutation[k - 1]]);
        if (distance >= bestDistance)
          break;
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPermutation = permutation;
      }
    }
    els.sort((a, b) => bestPermutation.indexOf(a.id) - bestPermutation.indexOf(b.id));
    for (let j = 0; j < els.length; j++)
      getParentRelDistance(els[j], [ox, oy], margin, childCache, parentCache, els[j - 1]);
  }
  return [nodes, rels];
}

function* permute(permutation: number[]) {
  const length = permutation.length;
  const c = Array(length).fill(0);
  let i = 1, k: number, p: number;

  yield permutation.slice();
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      yield permutation.slice();
    } else {
      c[i] = 0;
      ++i;
    }
  }
}

function getParentRelDistance(node: Node, o: Vector, margin: Vector, childsRelsCache: { [key: number]: Relationship[] }, parentsRelsCache: { [key: number]: Relationship[] }, previousNode?: Node): number {
  //We save the old pos to make a delta
  let [oldX, oldY] = [node.x, node.y];
  //We set x origin and we set dynamically y origin :
  //bottom position of the older sibling + margin
  node.x = o[0];
  if (previousNode)
    node.y = previousNode.y + previousNode.height + margin[1];
  else
    node.y = o[1];

  const parents = parentsRelsCache[node.id];
  for (const rel of parents) {
    rel.ex += node.x - oldX;
    rel.ey += node.y - oldY;
  }
  for (const rel of childsRelsCache[node.id]) {
    rel.ox += node.x - oldX;
    rel.oy += node.y - oldY;
  }
  return parents.reduce((prev, curr) => prev + Math.sqrt(square(curr.ex - curr.ox) + square(curr.ey - curr.oy)), 0);
}

function square(d: number) {
  return d * d;
}

