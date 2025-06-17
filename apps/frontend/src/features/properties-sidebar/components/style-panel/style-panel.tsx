import { Editor, EnumStyleProp, TLShape, useEditor } from "tldraw";
import classes from "./style-panel.module.css";
import { DashPicker } from "./pickers/dash-picker";
import { ColorPicker } from "./pickers/color-picker";
import { SizePicker } from "./pickers/size-picker";
import { FillPicker } from "./pickers/fill-picker";
import { FontPicker } from "./pickers/font-picker";
import { VerticalAlignPicker } from "./pickers/vertical-align-picker";
import { HorizontalAlignPicker } from "./pickers/horizontal-align-picker";
import { TextAlignPicker } from "./pickers/text-align-picker";
import { LabelColorPicker } from "./pickers/label-color-picker";
import { GeoPicker } from "./pickers/geo-picker";

export type ExtractStyleOptions<T> = T extends EnumStyleProp<infer U>
  ? U
  : never;

type ShapePanelProps = {
  shape: TLShape;
};

const getStylePropKeysForShape = (
  editor: Editor,
  shapeType: TLShape["type"]
) => {
  const shapeStyleMap = editor.styleProps[shapeType];
  if (!shapeStyleMap) return [];
  return Array.from(shapeStyleMap.keys()).map((prop) =>
    prop.id.replace(/^tldraw:/, "")
  ) as keyof TLShape["props"];
};

export function StylePanel({ shape }: ShapePanelProps) {
  const editor = useEditor();
  const availableProps = getStylePropKeysForShape(editor, shape.type);
  return (
    <div className={classes.container}>
      {availableProps.map((prop) => {
        switch (prop) {
          case "color":
            return <ColorPicker key="color" />;
          case "dash":
            return <DashPicker key="dash" />;
          case "size":
            return <SizePicker key="size" />;
          case "font":
            return <FontPicker key="font" />;
          case "fill":
            return <FillPicker key="fill" />;
          case "textAlign":
            return <TextAlignPicker key="text-align" />;
          case "horizontalAlign":
            return <HorizontalAlignPicker key="horizontal-align" />;
          case "verticalAlign":
            return <VerticalAlignPicker key="vertical-align" />;
          case "geo":
            return <GeoPicker key="geo-align" />;
          case "labelColor":
            return <LabelColorPicker key="label-color" shape={shape} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
