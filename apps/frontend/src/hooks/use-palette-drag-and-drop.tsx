import { useRef, DragEvent, useState } from "react";
import { PaletteItem } from "../features/palette/palette-container";
import { Editor, Vec } from "tldraw";
import { dataFormat } from "../utils/const";
import { updateEditorMeta } from "../utils/editor-meta";

function addShape(editor: Editor, event: DragEvent) {
  const shape = editor.getInstanceState().meta.draggedShape as
    | PaletteItem
    | undefined;
  if (!shape) {
    console.warn("No draggedShape in meta");
    return;
  }

  const point = editor.screenToPage(new Vec(event.clientX, event.clientY));

  editor.createShape({
    type: shape.type,
    x: point.x,
    y: point.y,
    props: shape.props,
  });
}

export function usePaletteDragAndDrop(canDrag: boolean, editor: Editor) {
  const [draggedItem, setDraggedItem] = useState<PaletteItem | null>();
  const zoom = editor.getZoomLevel();

  const ref = useRef<HTMLDivElement>(null);

  function onMouseDown(paletteItem: PaletteItem) {
    if (canDrag) {
      setDraggedItem(paletteItem);
    }
  }

  function onDragStart(event: DragEvent) {
    if (!canDrag) {
      return event.preventDefault();
    }
    event.dataTransfer.setDragImage(ref.current as Element, 0, 0);
    event.dataTransfer.setData(dataFormat, JSON.stringify(draggedItem));
    updateEditorMeta(editor, { draggedShape: { ...draggedItem } });
  }

  function onDragEnd(event: DragEvent) {
    setDraggedItem(null);
    editor.selectNone();
    addShape(editor, event);
    updateEditorMeta(editor, { draggedShape: null });
  }

  return {
    draggedItem,
    zoom,
    ref,
    onMouseDown,
    onDragStart,
    onDragEnd,
  };
}
