import { findLevelByNode } from 'src/app/utils/tree.utils';
import { NodeStruct } from './../utils/tree.utils';
import { findDepth, findNodesByLevel, _findNodesLevels, _createCustomNode } from '../utils/tree.utils';
import { Vector } from './../../types/global.d';
import { Bounds, Node, Relationship } from '../models/api/blueprint.model';

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

function autoPosBlueprint(nodes: Node[], rels: Relationship[], margin: Vector, node?: Node): Node[] {
  const outputNodes: Node[] = [];
  const nodesData: NodeStruct = Object.fromEntries(nodes.map(el => [el.id.toString(), new Node(el)]));
  const root = nodes.find(el => el.isRoot);
  const nodeLevel = node ? findLevelByNode(node, root, nodes, rels) : null;
  //We get the depth of the blueprint
  const depth = nodeLevel || findDepth(root, rels, nodesData);

  const nodesLevelCache = _findNodesLevels(_createCustomNode(root), rels, nodes.map(node => _createCustomNode(node)), -1, 0);
  // const childCache: RelationshipBoundsCache = Object.fromEntries(nodes.map(node => [node.id.toString(), []]));
  const parentCache: RelationshipCache = Object.fromEntries(nodes.map(node => [node.id.toString(), []]));
  for (let rel of rels) {
    parentCache[rel.childId].push(new Relationship(rel));
  }

  //Foreach level we get all the nodes and their parents
  for (let i = nodeLevel || 1; i < depth + 1; i++) {
    let els = findNodesByLevel(root, rels, nodes, i, 0, nodesLevelCache).map(node => new Node(node));
    const parents = i > 1 ? findNodesByLevel(root, rels, nodes, i - 1, 0, nodesLevelCache) : [root];

    //We compute an horizontal origin from the max right pos of the parents + the margin
    const ox = parents.reduce((prev, curr) => prev > curr.width + curr.x ? prev : curr.width + curr.x, 0) + margin[0];
    //We compute a vertical origin from the height of all the sibligs + this margin
    const oy = - (els.reduce((prev, curr) => prev + curr.height + margin[1], 0) / 2) + margin[1];
    //We clones the nodes and the rels to make a simulation
    const clonedNodes: Node[] = Object.create(els);
    let bestPermutation: number[], bestDistance: number = Infinity;

    const clonedNodesById: NodeStruct = Object.fromEntries(clonedNodes.map(node => [node.id.toString(), node]));

    //We simulate all the permutation to find the best one
    for (const permutation of permute(clonedNodes.map(el => el.id))) {
      //For each cloned siblings
      let distance = 0;
      let ey = oy;
      for (let k = 0; k < permutation.length; k++) {
        clonedNodesById[permutation[k]].y = ey;
        distance += getParentRelDistance(parentCache[permutation[k]], nodesData);
        if (distance >= bestDistance)
          break;
        ey += clonedNodesById[permutation[k]].height + margin[1];
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPermutation = permutation;
      }
    }
    console.log(bestDistance, bestPermutation);
    els.sort((a, b) => bestPermutation.indexOf(a.id) - bestPermutation.indexOf(b.id));
    // We apply the permutation to the nodes and the rels
    let ey = oy;
    for (let j = 0; j < els.length; j++) {
      els[j].x = ox;
      els[j].y = ey;
      ey += els[j].height + margin[1];
      outputNodes.push(els[j]);
    }
  }
  return outputNodes;
}

/**
 * Computes the permutation of the array
 */
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

/**
 * Get the sum of all the distance between the node and its parents
 */
function getParentRelDistance(parentRels: Relationship[], nodes: NodeStruct): number {
  //We save the old pos to make a delta
  let distance = 0;
  for (const rel of parentRels) {
    const origin = rel.getOrigin(nodes[rel.parentId].bounds);
    const destination = rel.getDestination(nodes[rel.childId].bounds);
    distance += Math.sqrt(square(destination[0] - origin[0]) + square(destination[1] - origin[1]));
  }
  return distance;
}

function square(d: number) {
  return d * d;
}

