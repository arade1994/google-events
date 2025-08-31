import styles from "./Events.module.scss";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const { logout } = useAuth();

  return (
    <>
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
      <h1>Events</h1>
    </>
  );
}
