import { useAuth } from "../../context/AuthContext";
import { useSyncEvents } from "../../hooks/useSyncEvents";
import styles from "./Header.module.scss";
import Spinner from "./Spinner";

export default function Header() {
  const { triggerSync, isSyncing } = useSyncEvents();
  const { logout } = useAuth();

  if (isSyncing) return <Spinner />;

  return (
    <header className={styles.header}>
      <h1>Events</h1>
      <div className={styles.actions}>
        <button onClick={() => triggerSync()} disabled={isSyncing}>
          Sync events
        </button>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
}
