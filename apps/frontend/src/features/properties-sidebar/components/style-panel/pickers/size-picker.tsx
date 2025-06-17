import { DefaultSizeStyle, useEditor, useRelevantStyles } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";

type SizeStyles = ExtractStyleOptions<typeof DefaultSizeStyle>;

const SIZE = ["s", "m", "l", "xl"] as const;

export function SizePicker() {
  const editor = useEditor();
  const handleClick = (size: SizeStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultSizeStyle, size);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultSizeStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Size</span>
      <div className={classes.options}>
        {SIZE.map((size) => (
          <button
            key={size}
            className={clsx(classes.button, {
              [classes.active]: size === active,
            })}
            onClick={() => handleClick(size)}
          >
            <div>{size.toUpperCase()}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
