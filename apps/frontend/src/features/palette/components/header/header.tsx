import { SidebarSimple } from "@phosphor-icons/react";
import styles from "./header.module.css";
import { NavButton } from "@synergycodes/axiom";

type PaletteHeaderProps = {
  onClick: () => void;
};

export function PaletteHeader({ onClick }: PaletteHeaderProps) {
  return (
    <div className={styles.container}>
      <span className="h7">Nodes Library</span>
      <NavButton size="small" icon={<SidebarSimple />} onClick={onClick} />
    </div>
  );
}
