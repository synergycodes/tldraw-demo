import { DefaultColorStyle, TLShape, useEditor, useValue } from "tldraw";
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

export function LabelColorPicker({ shape }: { shape: TLShape }) {
  const editor = useEditor();

  const updatedShape = useValue(
    "labelColor",
    () => {
      return editor.getShape(shape);
    },
    [shape]
  );
  if (!updatedShape || !("labelColor" in updatedShape.props)) return;
  const active = updatedShape.props.labelColor;

  const handleClick = (color: ColorStyles) => {
    editor.run(
      () => {
        editor.markHistoryStoppingPoint();
        editor.updateShape({
          id: shape.id,
          type: shape.type,
          props: {
            labelColor: color,
          },
        });
      },
      { history: "record" }
    );
  };

  return (
    <div>
      <span>Label Color</span>
      <div className={classes.options}>
        {COLORS.map(([name, color]) => (
          <button
            key={name}
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
