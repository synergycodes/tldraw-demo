import {
  DefaultHorizontalAlignStyle,
  useEditor,
  useRelevantStyles,
} from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";
import {
  AlignCenterHorizontalSimpleIcon,
  AlignLeftSimpleIcon,
  AlignRightSimpleIcon,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

type HorizontalAlignStyles = ExtractStyleOptions<
  typeof DefaultHorizontalAlignStyle
>;

const ALIGN = [
  "start",
  "middle",
  "end",
] as const;

const ALIGN_ICON: Record<string, ReactNode> = {
  start: <AlignLeftSimpleIcon size={16} />,
  middle: <AlignCenterHorizontalSimpleIcon size={16} />,
  end: <AlignRightSimpleIcon size={16} />,
};

export function HorizontalAlignPicker() {
  const editor = useEditor();
  const handleClick = (align: HorizontalAlignStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultHorizontalAlignStyle, align);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultHorizontalAlignStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Horizontal Align</span>
      <div className={classes.options}>
        {ALIGN.map((align) => (
          <button
            key={align}
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
