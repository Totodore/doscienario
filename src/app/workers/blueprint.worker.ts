import { findChildRels, findDepth, findNodesByLevel, findParentRels } from '../utils/tree.utils';
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


function autoPosBlueprint(nodes: Node[], rels: Relationship[], margin: Vector): [Node[], Relationship[]] {
  //@ts-ignore
  const nodesData: NodeStruct = Object.fromEntries(nodes.map(el => [el.id, el]));
  const root = nodes.find(el => el.isRoot);
  //We get the depth of the blueprint
  const depth = findDepth(root, rels, nodesData);

  //Foreach level we get all the nodes and their parents
  for (let i = 1; i < depth + 1; i++) {
    let els = findNodesByLevel(root, rels, nodes, i);
    const parents = i > 1 ? findNodesByLevel(root, rels, nodes, i - 1) : [root];

    //We compute an horizontal origin from the max right pos of the parents + the margin
    const ox = parents.reduce((prev, curr) => prev > curr.width + curr.x ? prev : curr.width + curr.x, 0) + margin[0];
    //We compute a vertical origin from the height of all the sibligs + this margin
    const oy = - (els.reduce((prev, curr) => prev + curr.height + margin[1], 0) / 2) + margin[1];

    //We clones the nodes and the rels to make a simulation
    const clonedNodes: Node[] = Object.create(els);
    const clonedRels: Relationship[] = Object.create(rels);
    let bestPermutation: number[], bestDistance: number = Infinity;
    //We simulate all the permutation to find the best one
    for (const permutation of permute(clonedNodes.map(el => el.id))) {
      //For each cloned siblings
      let distance = 0;
      for (let k = 0; k < permutation.length; k++) {
        const node = clonedNodes.find(el => el.id == permutation[k]);
        const previousNode = clonedNodes.find(el => el.id == permutation[k - 1]);
        distance += getParentRelDistance(node, [ox, oy], margin, clonedRels, previousNode);
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        bestPermutation = permutation;
      }
    }
    els.sort((a, b) => bestPermutation.indexOf(a.id) - bestPermutation.indexOf(b.id));
    for (let j = 0; j < els.length; j++)
      getParentRelDistance(els[j], [ox, oy], margin, rels, els[j - 1]);
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

function getParentRelDistance(node: Node, o: [number, number?], margin: Vector, rels: Relationship[], previousNode?: Node): number {
  //We save the old pos to make a delta
  let [oldX, oldY] = [node.x, node.y];
  //We set x origin and we set dynamically y origin :
  //bottom position of the older sibling + margin
  node.x = o[0];
  if (previousNode)
    node.y = previousNode.y + previousNode.height + margin[1];
  else
    node.y = o[1];

  const parents = findParentRels(node, rels);
  for (const rel of parents) {
    rel.ex += node.x - oldX;
    rel.ey += node.y - oldY;
  }
  for (const rel of findChildRels(node, rels)) {
    rel.ox += node.x - oldX;
    rel.oy += node.y - oldY;
  }
  return parents.reduce((prev, curr) => prev + Math.sqrt(Math.pow(curr.ex - curr.ox, 2) + Math.pow(curr.ey - curr.oy, 2)), 0);
}

