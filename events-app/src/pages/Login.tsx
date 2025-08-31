import { useCallback, useEffect } from "react";
import styles from "./Login.module.scss";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/events");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = useCallback(() => {
    window.location.href = "http://localhost:4000/auth/google";
  }, []);

  return (
    <div className={styles.container}>
      <h1>Login</h1>

      <button className={styles.loginButton} onClick={handleLogin}>
        Login with Google
      </button>
    </div>
  );
}
