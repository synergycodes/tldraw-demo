import { useEditor, TLBaseShape } from "tldraw";

export function useUpdateShape<
  T extends TLBaseShape<string, Record<string, unknown>>
>() {
  const editor = useEditor();

  function updateProp<K extends keyof T["props"]>(
    shape: T,
    key: K,
    value: T["props"][K],
    mark = true
  ) {
    editor.updateShape({
      ...shape,
      props: {
        [key]: value,
      },
    });

    if (mark) editor.markHistoryStoppingPoint();
  }

  function updateProps(shape: T, newProps: Partial<T["props"]>, mark = true) {
    editor.updateShape({
      ...shape,
      props: {
        ...shape.props,
        ...newProps,
      },
    });

    if (mark) editor.markHistoryStoppingPoint();
  }

  return { updateProp, updateProps };
}
