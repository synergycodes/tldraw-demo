import {
  IconSwitch,
  Menu,
  MenuItemProps,
  NavButton,
} from "@synergycodes/axiom";
import {
  ExportIcon,
  ImageIcon,
  DownloadSimpleIcon,
  DotsThreeVerticalIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import { useMemo } from "react";
import styles from "./top-navbar.module.css";
import { PeopleMenu } from "tldraw";
import { ShareButton } from "./share-button";

type ControlsProps = {
  onExport: () => void;
  onImport: () => void;
  onExportAsImage: () => void;
  onToggleReadOnly: () => void;
  isReadOnlyMode: boolean;
  mode: "local" | "remote" | "sync-demo";
};

export function Controls({
  onExport,
  onImport,
  onExportAsImage,
  onToggleReadOnly,
  isReadOnlyMode,
  mode,
}: ControlsProps) {
  console.log(mode)
  const items: MenuItemProps[] = useMemo(
    () => [
      {
        label: "Export",
        icon: <ExportIcon />,
        onClick: onExport,
      },
      {
        label: "Import",
        icon: <DownloadSimpleIcon />,
        onClick: onImport,
      },
      {
        label: "Save As Image",
        icon: <ImageIcon />,
        onClick: onExportAsImage,
      },
      {
        type: "separator",
      },
    ],
    [onExport, onImport, onExportAsImage]
  );
  return (
    <div className={styles.controls}>
      {mode !== "local" && (
        <>
          <ShareButton />
          <PeopleMenu />
        </>
      )}

      {mode === "local" && (
        <IconSwitch
          checked={isReadOnlyMode}
          onChange={onToggleReadOnly}
          icon={<PencilSimpleIcon />}
          IconChecked={<PencilSimpleIcon />}
        />
      )}
      <div className={styles.menuContainer}>
        <Menu items={items}>
          <NavButton tooltip="Menu" icon={<DotsThreeVerticalIcon />} />
        </Menu>
      </div>
    </div>
  );
}
