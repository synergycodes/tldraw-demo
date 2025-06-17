import { DefaultColorStyle, useEditor, useRelevantStyles } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";

type ColorStyles = ExtractStyleOptions<typeof DefaultColorStyle>;

const COLORS = [
  ["black", "black"],
  ["grey", "#9fa8b2"],
  ["light-violet", "#e085f4"],
  ["violet", "#ae3ec9"],
  ["blue", "#4465e9"],
  ["light-blue", "rgb(155, 196, 253)"],
  ["yellow", "#f1ac4b"],
  ["orange", "#e16919"],
  ["green", "green"],
  ["light-green", "#4cb05e"],
  ["light-red", "#f87777"],
  ["red", "red"],
] as const;

export function ColorPicker() {
  const editor = useEditor();
  const handleClick = (color: ColorStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultColorStyle, color);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultColorStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Color</span>
      <div className={classes.options}>
        {COLORS.map(([name, color]) => (
          <button
            key={`color-${name}`}
            className={clsx(classes.button, {
              [classes.active]: name === active,
            })}
            style={{ color }}
            onClick={() => handleClick(name)}
          >
            <div className={classes.icon}></div>
          </button>
        ))}
      </div>
    </div>
  );
}
