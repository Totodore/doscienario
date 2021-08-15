import { TagTree } from './../models/tag.model';

import { Blueprint } from '../models/sockets/blueprint-sock.model';
import { Document, SearchResults } from '../models/api/project.model';
import { Tag } from '../models/sockets/tag-sock.model';
import { sortByRelevance } from '../utils/helpers';

/// <reference lib="webworker" />
addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  if (e.data[0].startsWith('getTagTree'))
    //@ts-ignore
    postMessage([e.data[0], getTagTree(...e.data[1])]);
});
/**
 * Get a tag tree (primary tag with their children) and the elements they have
 * The needle allow the results to be filtered with the needle (it can be a tag name or an element title)
 */
function getTagTree(tags: Tag[], needle: string, els: (Document | Blueprint)[]): TagTree[] {
  if (needle.startsWith('#'))
    needle = needle.substr(1);
  const isSearching = needle?.length > 0;
  const allowedEls = els.filter(el => ((el as Document)?.title || (el as Blueprint)?.name).toLowerCase().includes(needle.toLowerCase())).map(el => el.id);
  const allowedTags = tags.filter(el => el.name.toLowerCase().includes(needle.toLowerCase())).map(el => el.id);
  return tags.filter(el => el.primary || (allowedTags.includes(el.id) && isSearching)).map(primary => {
    const childEls = els.filter(el => el.tags.find(el => el.id === primary.id));
    const children: Tag[] = els.reduce(
      (prev, curr) =>
        [...prev, ...curr.tags.find(el => el.id === primary.id) ? curr.tags.filter(el => !el.primary) : []],
      []);
    /**
     * If their is no children tag allowed, that the primary tag is not allowed and that their is no child elements allowed
     * We don't return the tag
     */
    if ((!children.reduce((prev, curr) => prev || allowedTags.includes(curr.id) ? true : false, false)
      && !childEls.reduce((prev, curr) => prev || allowedEls.includes(curr.id) ? true : false, false)
      && !allowedTags.includes(primary.id))
      || childEls?.length == 0)
      return null;
    return {
      primary,
      children,
      els: childEls,
      sortIndex: childEls.reduce((prev, curr) => prev + curr.lastEditing.getTime(), 0) / (childEls.length || 1),
    }
  }).filter(el => el).sort((a, b) => !a.primary.primary ? -1 : (b.sortIndex - a.sortIndex));
}
