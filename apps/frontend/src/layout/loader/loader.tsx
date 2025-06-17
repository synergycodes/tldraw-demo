import Logo from "../../assets/workflow-builder-logo.svg";
import styles from "./loader.module.css";
export function Loader() {
  return (
    <div className={styles.container}>
      <img src={Logo} className={styles.logo} />
      <div>
        <div className={styles.dotsLoader}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
