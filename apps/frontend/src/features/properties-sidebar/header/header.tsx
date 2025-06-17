import styles from "./properties-bar-header.module.css";

type Props = {
  header: string;
  name: string;
  isExpanded: boolean;
};

export function PropertiesBarHeader({ isExpanded, header, name }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.textContainer}>
        <span className={name ? "h9" : "h7"}>{header}</span>
        {isExpanded && <p className="p11">{name}</p>}
      </div>
    </div>
  );
}
