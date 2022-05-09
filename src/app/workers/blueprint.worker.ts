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
  const startNodeLevel = node ? findLevelByNode(node, root, nodes, rels) : null;
  const depth = startNodeLevel || findDepth(root, rels, nodesData);

  // Nodes by level(s) (a node may have multiple levels)
  // We have to regenerate
  const nodesLevelCache = _findNodesLevels(_createCustomNode(root), rels, Object.values(nodesData).map(node => _createCustomNode(node)), -1, 0);

  // Parent relationships by node id
  const parentCache: RelationshipCache = Object.fromEntries(nodes.map(node => [node.id.toString(), []]));
  for (let rel of rels)
    parentCache[rel.childId].push(new Relationship(rel));
    //Foreach level we get all the nodes and their parents
    for (let i = startNodeLevel || 1; i < depth + 1; i++) {
    let levelNodes = findNodesByLevel(root, rels, nodes, i, 0, nodesLevelCache).map(node => new Node(node));
    const parents = i > 1 ? findNodesByLevel(root, rels, nodes, i - 1, 0, nodesLevelCache) : [root];

    //We compute an horizontal origin from the max right pos of the parents + the margin
    const ox = parents.reduce((prev, curr) => prev > curr.width + curr.x ? prev : curr.width + curr.x, 0) + margin[0];
    //We compute a vertical origin from the height of all the sibligs + this margin
    const oy = - (levelNodes.reduce((prev, curr) => prev + curr.height + margin[1], 0) / 2) + margin[1] / 2;
    //We clones the nodes and the rels to make a simulation
    let bestPermutation: number[], bestDistance: number = Infinity;
    //We simulate all the permutation to find the best one
    for (const permutation of permute(levelNodes.map(el => el.id))) {
      // For each cloned siblings
      // Summed distance between the nodes and its parent
      let distance = 0;
      let ey = oy;
      for (let k = 0; k < permutation.length; k++) {
        ey += nodesData[permutation[k]].height / 2;
        nodesData[permutation[k]].y = ey;
        distance += getParentRelDistance(parentCache[permutation[k]], nodesData);
        if (distance >= bestDistance)
          break;
        ey += nodesData[permutation[k]].height / 2 + margin[1];
      }
      // If the distance is lower than the best distance we save the permutation
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPermutation = permutation;
      }
    }
    levelNodes.sort((a, b) => bestPermutation.indexOf(a.id) - bestPermutation.indexOf(b.id));
    // We apply the permutation to the nodes and the rels
    let ey = oy;
    for (let j = 0; j < levelNodes.length; j++) {
      levelNodes[j].x = ox;
      ey += levelNodes[j].height / 2;
      levelNodes[j].y = ey;
      ey += levelNodes[j].height / 2 + margin[1];

      outputNodes.push(levelNodes[j]);

      nodesData[levelNodes[j].id].x = ox;
      nodesData[levelNodes[j].id].y = ey;
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

