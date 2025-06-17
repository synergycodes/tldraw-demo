import styles from "./top-navbar.module.css";
import Logo from "../../assets/workflow-builder-logo.svg";
import { NavButton } from "@synergycodes/axiom";
import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  FloppyDiskIcon,
  FolderOpenIcon,
} from "@phosphor-icons/react";
interface ToolbarProps {
  onSave: () => void;
  onOpen: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  onSave,
  onOpen,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <img src={Logo} className={styles.logo} />
      <div className={styles.navSegment}>
        <NavButton onClick={onSave} icon={<FloppyDiskIcon />} tooltip="Save" />
        <NavButton onClick={onOpen} icon={<FolderOpenIcon />} tooltip="Open" />
        <NavButton
          onClick={() => {
            onUndo();
          }}
          icon={<ArrowUUpLeftIcon />}
          disabled={!canUndo}
          tooltip="Undo"
        />
        <NavButton
          onClick={onRedo}
          icon={<ArrowUUpRightIcon />}
          disabled={!canRedo}
          tooltip="Redo"
        />
      </div>
    </div>
  );
}
