import { DefaultFontStyle, useEditor, useRelevantStyles } from "tldraw";
import clsx from "clsx";
import classes from "../style-panel.module.css";
import { ExtractStyleOptions } from "../style-panel";

type FontStyles = ExtractStyleOptions<typeof DefaultFontStyle>;

const FONT = ["draw", "mono", "sans", "serif"] as const;

export function FontPicker() {
  const editor = useEditor();
  const handleClick = (font: FontStyles) => {
    editor.run(
      () => {
        editor.setStyleForSelectedShapes(DefaultFontStyle, font);
        editor.markHistoryStoppingPoint();
      },
      { history: "record" }
    );
  };

  const styles = useRelevantStyles();
  if (!styles) return null;
  const sharedStyle = styles.get(DefaultFontStyle);

  const active = sharedStyle?.type === "shared" && sharedStyle.value;
  return (
    <div>
      <span>Font</span>
      <div className={classes.options}>
        {FONT.map((font) => (
          <button
            key={font}
            className={clsx(classes.button, {
              [classes.active]: font === active,
            })}
            onClick={() => handleClick(font)}
          >
            <div>{font}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
