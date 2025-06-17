import { DefaultDashStyle, useEditor, useRelevantStyles } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";

type DashStyles = ExtractStyleOptions<typeof DefaultDashStyle>;

const DASH = ["dashed", "dotted", "draw", "solid"] as const;

export function DashPicker() {
  const editor = useEditor();
  const handleClick = (name: DashStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultDashStyle, name);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultDashStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Dash</span>
      <div className={classes.options}>
        {DASH.map((name) => (
          <button
            key={name}
            className={clsx(classes.button, {
              [classes.active]: name === active,
            })}
            onClick={() => handleClick(name)}
          >
            <div>{name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
