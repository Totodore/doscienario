import { CKEditor5 } from "@ckeditor/ckeditor5-angular";

export function applyTabPlugin(editor: CKEditor5.Editor) {
  editor.keystrokes.set('Tab', (data: any, cancel: () => void) => {
    const command = editor.commands.get('indentBlock');
    if (command.isEnabled) {
      command.execute();
      cancel();
    }
  });

  editor.keystrokes.set('Shift+Tab', (data: any, cancel: () => void) => {
    const command = editor.commands.get('outdentBlock');

    if (command.isEnabled) {
      command.execute();
      cancel();
    }
  });

  editor.keystrokes.set('Backspace', (data: any, cancel: () => void) => {
    const command = editor.commands.get('outdentBlock');

    const positionPath: number[] = editor.model.document.selection.getFirstRange().start.path;

    if (positionPath[positionPath.length - 1] === 0 && command.isEnabled) {
      command.execute();
      cancel();
    }
  });
}

/**
 * Find a string from a selection
 */
export function findStrFromSelection(s: Selection) {
  const range = s.getRangeAt(0);
  const node = s.anchorNode;
  const content = node.textContent;

  let startOffset = range.startOffset;
  let endOffset = range.endOffset;
  // Find starting point
  // We move the cursor back until we find a space a line break or the start of the node
  do {
    startOffset--;
  } while (startOffset > 0 && content[startOffset - 1] != " " && content[startOffset - 1] != '\n');

  // Find ending point
  // We move the cursor forward until we find a space a line break or the end of the node
  do {
    endOffset++;
  } while (content[endOffset] != " " && content[endOffset] != '\n' && endOffset < content.length);
  
  return {
    str: content.substring(startOffset, endOffset),
    offset: [startOffset, endOffset],
    node
  };
}