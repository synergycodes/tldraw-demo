import styles from "./app.module.css";
import DiagramRemote from "./features/diagram/diagram-remote";
import DiagramLocal from "./features/diagram/diagram-local";
import { useHealthcheck } from "./hooks/use-healthcheck";
import { Loader } from "./layout/loader/loader";
export default function App() {
  const status = useHealthcheck(`${import.meta.env.VITE_API_URL}/healthcheck`)
  return (
    <div className={styles.container}>
      {status === 'connecting' &&  <Loader/>}
      {status === 'online'? <DiagramRemote/> : <DiagramLocal/>}
    </div>
  );
}
