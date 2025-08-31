"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/services/api.service";
import { addToast } from "@heroui/toast";

interface User {
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialLoading: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setUser({ isAuthenticated: true });
    }
    setInitialLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });
      const { accessToken, refreshToken } = data.data;

      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      setUser({ isAuthenticated: true });
      router.push("/");

      addToast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        color: "success",
      });
    } catch (error) {
      console.error("Login failed:", error);
      addToast({
        title: "Login Failed",
        description: "Invalid email or password.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, initialLoading }}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
