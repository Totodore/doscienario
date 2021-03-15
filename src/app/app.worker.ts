import { GetProjectDocumentRes, SearchResults } from './models/api/project.model';
import { Tag } from './models/sockets/tag-sock.model';
import { Change } from './models/sockets/document-sock.model';
import * as diff from "diff";
import { sortByRelevance } from './utils/helpers';
/// <reference lib="webworker" />

addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  if (e.data == "hello")
    console.log("Worker started");
  else if (e.data[0].startsWith("diff"))
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
    if (needle[1] === '*')
      docs = data[1];
    else
      docs.push(...data[1].filter(el => el.title.toLowerCase().includes(needle.substr(1))));
  } else if (needle.startsWith('#')) {
    /**
     * Search tags and docs that have these tags
     */
    if (needle[1] === '*')
      tags = data[0];
    else {
      tags.push(...data[0].filter(tag => tag.name.toLowerCase().includes(needle.substr(1))));
      docs.push(...data[1].filter(doc => doc.tags.find(docTag => tags.map(el => el.name).includes(docTag.name))));
    }
  } else if (needle === '*') {
    [tags, docs] = data;
  } else {
    /**
     * Search tags, docs and docs affiliated with these tags
     */
    if (needle[1] === '*')
      tags = data[0];
    else {
      docs.push(...data[1].filter(el => el.title.toLowerCase().includes(needle.substr(1))));
      tags.push(...data[0].filter(tag => tag.name.toLowerCase().includes(needle.substr(1))));
      docs.push(...data[1].filter(doc => doc.tags.find(docTag => tags.map(el => el.name).includes(docTag.name))));
    }
  }
  //Make results unique and sort them by relevance
  const docsIds = docs.map(el => el.id).reduce<number[]>((prev, curr) => [...prev, curr], []);
  const tagsIds = tags.map(el => el.name).reduce<string[]>((prev, curr) => [...prev, curr], []);
  docs = docs
    .filter(doc => docsIds.includes(doc.id))
    .sort((a, b) => sortByRelevance(a, b, needle, (el) => el.title));
  tags = tags
    .filter(tag => tagsIds.includes(tag.name))
    .sort((a, b) => sortByRelevance(a, b, needle, el => el.name));

  /**
   * Alternative merge
   */
  let els: SearchResults;
  if (docs.length > tags.length)
    els = docs.reduce((prev, curr, i) => [...prev, curr, tags[i]], []).filter(el => el != null);
  else
    els = tags.reduce((prev, curr, i) => [...prev, curr, docs[i]], []).filter(el => el != null);
  return els;
}
