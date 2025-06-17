import { useValue, useEditor } from "tldraw";
import { FamilyMemberShape } from "../palette/components/items/family";
import styles from "./properties-sidebar.module.css";
import { Sidebar } from "../../components/sidebar/sidebar";
import { PropertiesBarHeader } from "./header/header";
import { LabelButton } from "@synergycodes/axiom";
import clsx from "clsx";
import { Content } from "./content/content";

const SHAPE_TYPES_WITHOUT_STYLES = new Set([
  "group",
  "frame",
  "image",
  "video",
  "embed",
]);

export const RightBar = function RightBar() {
  const editor = useEditor();

  const selectedShapes = useValue(
    "selectedShapes",
    () => editor.getSelectedShapeIds(),
    []
  );

  const isReadOnlyMode = useValue(
    "getIsReadonly",
    () => editor.getIsReadonly(),
    []
  );

  const selectedShape = useValue(
    "selectedShape",
    () =>
      selectedShapes.length === 1 ? editor.getShape(selectedShapes[0]) : null,
    [selectedShapes]
  );

  const isExpandable =
    selectedShape && !SHAPE_TYPES_WITHOUT_STYLES.has(selectedShape.type);
  const isExpanded = selectedShapes.length === 1 && !!isExpandable;

  return (
    <aside
      className={clsx(styles.container, {
        [styles.isExpanded]: isExpanded,
      })}
    >
      <Sidebar
        isExpanded={isExpanded}
        header={
          <PropertiesBarHeader
            isExpanded={isExpanded}
            header={"Properties"}
            name={
              (isExpanded &&
                (selectedShape.type === "family-member"
                  ? (selectedShape as FamilyMemberShape).props.firstName
                  : selectedShape.type)) ||
              ""
            }
          />
        }
        footer={
          selectedShape && (
            <LabelButton
              onClick={() => editor.deleteShape(selectedShape.id)}
              label={"delete"}
              variant="ghost-destructive"
            />
          )
        }
      >
        {selectedShape && (
          <Content shape={selectedShape} isReadOnlyMode={isReadOnlyMode} />
        )}
      </Sidebar>
    </aside>
  );
};
