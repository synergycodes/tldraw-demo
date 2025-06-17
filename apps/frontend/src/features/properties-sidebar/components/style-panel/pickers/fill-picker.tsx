import { DefaultFillStyle, useEditor, useRelevantStyles } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";

type FillStyles = ExtractStyleOptions<typeof DefaultFillStyle>;

const FILL = ["fill", "none", "pattern", "semi", "solid"] as const;

export function FillPicker() {
  const editor = useEditor();
  const handleClick = (fill: FillStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultFillStyle, fill);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultFillStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Fill</span>
      <div className={classes.options}>
        {FILL.map((fill) => (
          <button
            key={fill}
            className={clsx(classes.button, {
              [classes.active]: fill === active,
            })}
            onClick={() => handleClick(fill)}
          >
            <div>{fill}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
