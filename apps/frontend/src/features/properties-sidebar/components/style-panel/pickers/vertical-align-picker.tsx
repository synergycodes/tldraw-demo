import {
  DefaultVerticalAlignStyle,
  useEditor,
  useRelevantStyles,
} from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";
import {
  AlignBottomSimple,
  AlignCenterVerticalSimple,
  AlignTopSimple,
} from "@phosphor-icons/react";
import { ReactNode } from "react";

type VerticalAlignStyles = ExtractStyleOptions<
  typeof DefaultVerticalAlignStyle
>;

const ALIGN = ["end", "middle", "start"] as const;

const ALIGN_ICON: Record<string, ReactNode> = {
  end: <AlignBottomSimple size={16} />,
  middle: <AlignCenterVerticalSimple size={16} />,
  start: <AlignTopSimple size={16} />,
};

export function VerticalAlignPicker() {
  const editor = useEditor();
  const handleClick = (align: VerticalAlignStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultVerticalAlignStyle, align);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultVerticalAlignStyle);

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
