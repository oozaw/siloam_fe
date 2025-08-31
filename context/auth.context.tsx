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
import { ApiResponse, LoginResponse, User } from "@/types";

interface AuthContextType {
  isAuthenticated?: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  initialLoading: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setIsAuthenticated(true);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data: response } = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        { email, password },
      );
      const { accessToken, refreshToken } = response.data;

      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      setIsAuthenticated(true);
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
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, initialLoading }}
    >
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
