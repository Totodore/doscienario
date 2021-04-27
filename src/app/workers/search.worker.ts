
import { Blueprint } from '../models/sockets/blueprint-sock.model';
import { GetProjectDocumentRes, SearchResults } from '../models/api/project.model';
import { Tag } from '../models/sockets/tag-sock.model';
import { sortByRelevance } from '../utils/helpers';

/// <reference lib="webworker" />
addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  if (e.data[0].startsWith('search'))
    //@ts-ignore
    postMessage([e.data[0], search(...e.data[1])]);
});

function search(needle: string, data: [Tag[], GetProjectDocumentRes[], Blueprint[]]): SearchResults {
  let tags: Tag[] = [];
  let docs: GetProjectDocumentRes[] = [];
  let blueprints: Blueprint[] = [];
  needle = needle.toLowerCase();
  if (needle.startsWith('@')) {
    /**
     * Search docs
     */
    if (needle[1] === '*') {
      docs = data[1];
      blueprints = data[2];
    }
    else {
      docs.push(...data[1].filter(el => el.title.toLowerCase().includes(needle.substr(1))));
      blueprints.push(...data[2].filter(el => el.name.toLowerCase().includes(needle.substr(1))));
    }
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
    [tags, docs, blueprints] = data;
  } else {
    /**
     * Search tags, docs and docs affiliated with these tags
     */
    if (needle[1] === '*')
      tags = data[0];
    else {
      docs.push(...data[1].filter(el => el.title.toLowerCase().includes(needle.substr(1))));
      blueprints.push(...data[2].filter(el => el.name.toLowerCase().includes(needle.substr(1))));
      tags.push(...data[0].filter(tag => tag.name.toLowerCase().includes(needle.substr(1))));
      docs.push(...data[1].filter(doc => doc.tags.find(docTag => tags.map(el => el.name).includes(docTag.name))));
      blueprints.push(...data[2].filter(blueprint => blueprint.tags.find(blueprintTag => tags.map(el => el.name).includes(blueprintTag.name))))
    }
  }
  //Make results unique and sort them by relevance
  const docsIds = docs.map(el => el.id).reduce<number[]>((prev, curr) => [...prev, curr], []);
  const tagsIds = tags.map(el => el.name).reduce<string[]>((prev, curr) => [...prev, curr], []);
  const blueprintIds = blueprints.map(el => el.id).reduce((prev, curr) => [...prev, curr], []);

  docs = docs
    .filter(doc => docsIds.includes(doc.id))
    .sort((a, b) => sortByRelevance(a, b, needle, (el) => el.title));
  tags = tags
    .filter(tag => tagsIds.includes(tag.name))
    .sort((a, b) => sortByRelevance(a, b, needle, el => el.name));
  blueprints = blueprints
    .filter(blueprint => blueprintIds.includes(blueprint.id))
    .sort((a, b) => sortByRelevance(a, b, needle, el => el.name));

  /**
   * Alternative merge
   */
  let els: SearchResults = [...blueprints, ...docs, ...tags];
  return els;
}
