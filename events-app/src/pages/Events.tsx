import styles from "./Events.module.scss";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Events() {
  const { logout } = useAuth();

  function handleSyncEvents() {
    fetch("http://localhost:4000/events/sync", {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) {
        toast.error("Failed to sync events");
      } else {
        toast.success("Events synced");
      }
    });
  }

  return (
    <>
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
      <h1>Events</h1>
      <button onClick={handleSyncEvents}>Sync events</button>
    </>
  );
}
