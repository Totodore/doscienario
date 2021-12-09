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