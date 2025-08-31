import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import styles from "./ProtectedRoute.module.scss";
import { useEffect } from "react";
import Spinner from "./Spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (
      <div className={styles.fullPage}>
        <Spinner />
      </div>
    );

  return children;
}
