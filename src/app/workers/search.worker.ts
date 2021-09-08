import { Blueprint } from '../models/sockets/blueprint-sock.model';
import { Document, SearchResults } from '../models/api/project.model';
import { Tag } from '../models/sockets/tag-sock.model';
import { sortByRelevance } from '../utils/helpers';
import { ElementModel } from '../models/default.model';
import { DocumentModel } from '../models/sockets/document-sock.model';

/// <reference lib="webworker" />
addEventListener('message', (e: MessageEvent<[string, any] | string>) => {
  if (e.data[0].startsWith('searchFromTags'))
    //@ts-ignore
    postMessage([e.data[0], searchFromTags(...e.data[1])]);
  else if (e.data[0].startsWith('filterSecondaryTags'))
    //@ts-ignore
    postMessage([e.data[0], filterSecondaryTags(...e.data[1])]);
});

/** 
 * We get all the elements if they have the selected @param tags and the @param needle as title
 */
function searchFromTags(tags: Tag[], needle: string | undefined, els: ElementModel[]) {
  return tags.length > 0 ? els.filter(el =>
    tags.reduce((prev, curr) => prev && !!el.tags.find(tag => tag.id === curr.id), true)
    && (
      (el as Blueprint).name?.toLowerCase()?.includes(needle?.toLowerCase() || '')
      || (el as DocumentModel).title?.toLowerCase()?.includes(needle?.toLowerCase() || '')
    )
  ).sort((a, b) => sortByRelevance(a, b, needle || '', el => (el as Blueprint).name || (el as DocumentModel).title)) : els;
}

/**
 * We get all the tags if they are common with other elements 
 */
function filterSecondaryTags(selectedTags: Tag[], els: ElementModel[]): Tag[] {
  return els.reduce(
    (prev, curr) => [...prev, ...(curr.tags.find(el => !!selectedTags.find(tag => tag.id === el.id)) ? curr.tags : [])], [])
    .filter(el => !el.primary);
}

/**
 * Get a tag tree (primary tag with their children) and the elements they have
 * The needle allow the results to be filtered with the needle (it can be a tag name or an element title)
 */
// function getTagTree(tags: Tag[], needle: string, els: (Document | Blueprint)[]): TagTree[] {
//   const isSearching = needle?.length > 0;
//   const allowedEls = (isSearching ? els.filter(el => ((el as Document)?.title || (el as Blueprint)?.name)?.toLowerCase()?.includes(needle?.toLowerCase())) : els).map(el => el.id);
//   const allowedTags = (isSearching ? tags.filter(el => ("#" + el.name?.toLowerCase()).includes(needle?.toLowerCase())) : tags).map(el => el.id);
//   const tagMatched = tags.find(el => '#' + el.name.toLowerCase() == needle?.toLowerCase());
//   return tags.filter(el => ((el.primary || (allowedTags.includes(el.id) && isSearching)) && (!tagMatched || el.id === tagMatched.id))).map(primary => {
//     const childEls = els.filter(el => el.tags.find(el => el.id === primary.id));
//     const children: Tag[] = els.reduce(
//       (prev, curr) =>
//         [...prev, ...curr.tags.find(el => el.id === primary.id) ? curr.tags.filter(el => !el.primary) : []],
//       []);
//     /**
//      * If their is no children tag allowed, that the primary tag is not allowed and that their is no child elements allowed
//      * We don't return the tag
//      */
//     if ((!children.reduce((prev, curr) => prev || allowedTags.includes(curr.id) ? true : false, false)
//       && !childEls.reduce((prev, curr) => prev || allowedEls.includes(curr.id) ? true : false, false)
//       && !allowedTags.includes(primary.id))
//       || childEls?.length == 0)
//       return null;
//     return {
//       primary,
//       children,
//       els: childEls,
//       sortIndex: childEls.reduce((prev, curr) => prev + curr.lastEditing.getTime(), 0) / (childEls.length || 1),
//     }
//   }).filter(el => el).sort((a, b) => !a.primary.primary ? -1 : (b.sortIndex - a.sortIndex));
// }
