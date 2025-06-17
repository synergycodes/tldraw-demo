import { Editor, JsonObject } from "tldraw";

type EditorMeta = Record<string, JsonObject[keyof JsonObject]>;

export function updateEditorMeta(editor: Editor, updates: Partial<EditorMeta>) {
  editor.updateInstanceState({
    meta: {
      ...editor.getInstanceState().meta,
      ...updates,
    },
  });
}

export function clearEditorMeta(editor: Editor) {
  editor.updateInstanceState({
    meta: {},
  });
}
