import { GetProjectDocumentRes, SearchResults } from './models/api/project.model';
import { Tag } from './models/sockets/tag-sock.model';
import { Change } from './models/sockets/document-sock.model';
import * as diff from "diff";
import { sortByRelevance } from './utils/helpers';
/// <reference lib="webworker" />

addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  if (e.data == "hello")
    console.log("Worker started");
  else if (e.data[0] == 'diff')
    //@ts-ignore
    postMessage([e.data[0], computeDiff(e.data[1])]);
  else if (e.data[0] == 'search')
    //@ts-ignore
    postMessage([e.data[0], search(...e.data[1])]);
});

function computeDiff([oldContent, newContent]: [string, string]): Change[] {
  let changes: Change[] = [];
  let i = 0;
  // console.log("Computing diff from thread...");
  for (const change of diff.diffChars(oldContent, newContent)) {
    if (change.added)
      changes.push([1, i, change.value]);
    else if (change.removed)
      changes.push([-1, i, change.value]);
    i += change.count;
  }
  return changes;
}

function search(needle: string, data: [Tag[], GetProjectDocumentRes[]]): SearchResults {
  let tags: Tag[] = [];
  let docs: GetProjectDocumentRes[] = [];
  needle = needle.toLowerCase();
  if (needle.startsWith('@')) {
    /**
     * Search docs
     */
    docs.push(...data[1].filter(el => el.title.toLowerCase().includes(needle.substr(1))));
  } else if (needle.startsWith('#')) {
    /**
     * Search tags and docs that have these tags
     */
    tags.push(...data[0].filter(tag => tag.name.toLowerCase().includes(needle.substr(1))));
    docs.push(...data[1].filter(doc => doc.tags.find(docTag => tags.map(el => el.name).includes(docTag.name))));
  } else {
    /**
     * Search tags, docs and docs affiliated with these tags
     */
    docs.push(...data[1].filter(el => el.title.toLowerCase().includes(needle.substr(1))));
    tags.push(...data[0].filter(tag => tag.name.toLowerCase().includes(needle.substr(1))));
    docs.push(...data[1].filter(doc => doc.tags.find(docTag => tags.map(el => el.name).includes(docTag.name))));
  }
  //Make results unique and sort them by relevance
  docs = docs.reduce<GetProjectDocumentRes[]>((prev, curr) => !prev.includes(curr) ? [...prev, curr] : prev, [])
    .sort((a, b) => sortByRelevance(a, b, needle, (el) => el.title));
  tags = tags.reduce<Tag[]>((prev, curr) => !prev.includes(curr) ? [...prev, curr] : prev, [])
    .sort((a, b) => sortByRelevance(a, b, needle, el => el.name));
  let els: SearchResults = [];
  const length = docs.length + tags.length;
  let j = 0;
  let k = 0;
  for (let i = 0; i < length; i++) {
    console.log(j, k);
    if (i % 2 === 0 && docs[j]) {
      els.push(docs[j])
      j++;
    } else if (tags[k]) {
      els.push(tags[k]);
      k++;
    }
  }
  return els;
}
