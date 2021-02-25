import { Change } from './models/sockets/document-sock.model';
import * as diff from "diff";
/// <reference lib="webworker" />

console.log("Worker started");
addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  if (e.data == "hello")
    console.log("Worker started");
  else if (e.data[0] == 'diff')
    postMessage([e.data[0], computeDiff(e.data[1])]);
});

function computeDiff([oldContent, newContent]: [string, string]): Change[] {
  let changes: Change[] = [];
  let i = 0;
  console.log("Compute diff from thread");
  for (const change of diff.diffChars(oldContent, newContent)) {
    if (change.added)
      changes.push([1, i, change.value]);
    else if (change.removed)
      changes.push([-1, i, change.value]);
    i += change.count;
  }
  return changes;
}
