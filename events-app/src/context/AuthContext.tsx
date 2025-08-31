import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { User } from "../types/User";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/auth/current_user", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          toast.error("Not logged in");
          throw new Error("Not logged in");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setIsLoading(false);
      })
      .catch(() => {
        setUser(null);
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
