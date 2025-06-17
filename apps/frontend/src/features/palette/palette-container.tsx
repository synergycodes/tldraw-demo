import { useState } from "react";
import { Sidebar } from "../../components/sidebar/sidebar";
import { PaletteHeader } from "./components/header/header";
import { PaletteItems } from "./components/items/palette-items";
import styles from "./palette-container.module.css";
import { DraggedItem } from "./components/dragged-item/dragged-item";

import { FamilyMemberShape } from "./components/items/family";
import { usePaletteDragAndDrop } from "../../hooks/use-palette-drag-and-drop";
import { track, useEditor } from "tldraw";
import clsx from "clsx";
import { FamilyMemberShapeComponent } from "../diagram/shapes/family-member/component/component";
export type PaletteItem = Pick<FamilyMemberShape, "type" | "props">;
const paletteItems: PaletteItem[] = [
  {
    type: "family-member",
    props: {
      firstName: "Man",
      lastName: "",
      birthDate: "10/10/2010",
      deathDate: "",
      w: 250,
      h: 60,
      gender: "male",
      photo: "",
    },
  },
  {
    type: "family-member",
    props: {
      firstName: "Woman",
      lastName: "",
      birthDate: "10/10/2010",
      deathDate: "",
      w: 250,
      h: 60,
      gender: "female",
    },
  },
];

export const PaletteContainer = track(function PaletteContainer() {
  const editor = useEditor();
  const isReadOnlyMode = editor.getIsReadonly();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  function toggleSidebar() {
    setIsSidebarExpanded((prev) => !prev);
  }

  const { draggedItem, zoom, ref, onMouseDown, onDragStart, onDragEnd } =
    usePaletteDragAndDrop(!isReadOnlyMode, editor);

  return (
    <aside
      className={clsx(styles.container, {
        [styles.isExpanded]: isSidebarExpanded,
      })}
    >
      <Sidebar
        isExpanded={isSidebarExpanded}
        header={<PaletteHeader onClick={toggleSidebar} />}
      >
        <PaletteItems
          items={paletteItems}
          onMouseDown={onMouseDown}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDisabled={isReadOnlyMode}
        />

        {draggedItem && (
          <DraggedItem ref={ref} zoom={zoom}>
            <FamilyMemberShapeComponent {...draggedItem.props} />
          </DraggedItem>
        )}
      </Sidebar>
    </aside>
  );
});
