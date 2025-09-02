import { useCallback, useEffect } from "react";
import styles from "./Login.module.scss";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import GoogleIcon from "../components/icons/GoogleIcon";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleLogin = useCallback(() => {
    window.location.href = "http://localhost:4000/auth/google";
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/events");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className={styles.container}>
      <h1>Welcome to Google Events</h1>

      <button className={styles.loginButton} onClick={handleLogin}>
        <GoogleIcon />
        <span>Log in with Google</span>
      </button>
    </div>
  );
}
