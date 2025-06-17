import { track } from "tldraw";
import styles from "./palette-items.module.css";
import { PaletteItem } from "../../palette-container";
import { DragEvent } from "react";
import clsx from "clsx";
import { FamilyMemberShapeComponent } from "../../../diagram/shapes/family-member/component/component";

type PaletteItemsProps = {
  items: PaletteItem[];
  onDragStart: (event: DragEvent) => void;
  onDragEnd: (event: DragEvent) => void;
  onMouseDown: (paletteItem: PaletteItem) => void;
  isDisabled?: boolean;
};

export const PaletteItems = track(function PaletteItems({
  items,
  onDragStart,
  onDragEnd,
  onMouseDown,
  isDisabled = false,
}: PaletteItemsProps) {
  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div
          className={clsx(styles.item, {
            [styles.disabled]: isDisabled,
          })}
          key={item.props.gender}
          onMouseDown={() => onMouseDown(item)}
          draggable={!isDisabled}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <FamilyMemberShapeComponent {...item.props} />
        </div>
      ))}
    </div>
  );
});
