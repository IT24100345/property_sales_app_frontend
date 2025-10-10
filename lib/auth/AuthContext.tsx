"use client";

import User from "@/types/user";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthContextType } from "@/types/auth";
import { getCurrentUser, loginRequest } from "./authService";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    setLoading(true);
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        router.push("/login");
        return;
      }

      getCurrentUser(savedToken)
        .then((checkedUser) => {
          setJwt(savedToken);
          setUser(checkedUser);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
          router.push("/login");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    checkAuth();
  }, [router]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    return loginRequest(username, password)
      .then((loginRes) => {
        setJwt(loginRes.jwt);
        setUser(loginRes);

        localStorage.setItem("token", loginRes.jwt);

        return true;
      })
      .catch((error) => {
        console.error("Login error:", error);
        return false;
      });
  };

  const logout = () => {
    setUser(null);
    setJwt(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, setUser, user, jwt, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
