import { DefaultTextAlignStyle, useEditor, useRelevantStyles } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";
import {
  TextAlignCenter,
  TextAlignLeft,
  TextAlignRight,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

type TextAlignStyles = ExtractStyleOptions<typeof DefaultTextAlignStyle>;

const ALIGN = ["start", "middle", "end"] as const;

const ALIGN_ICON: Record<string, ReactNode> = {
  start: <TextAlignLeft size={16} />,
  middle: <TextAlignCenter size={16} />,
  end: <TextAlignRight size={16} />,
};

export function TextAlignPicker() {
  const editor = useEditor();
  const handleClick = (align: TextAlignStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultTextAlignStyle, align);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultTextAlignStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Vertical Align</span>
      <div className={classes.options}>
        {ALIGN.map((align) => (
          <button
            key={`text-${align}`}
            className={clsx(classes.button, {
              [classes.active]: align === active,
            })}
            onClick={() => handleClick(align)}
          >
            <div>{ALIGN_ICON[align]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
