"use client";

import User from "@/types/user";
import { createContext, useContext, useState, ReactNode } from "react";
import { API_URL } from "./config/apiConfig";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  jwt: string | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

type LoginResponse = {
  id: string;
  email: string;
  username: string;
  roles: string[];
  jwt: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const isAuthenticated = !!user;

  const login = async (username: string, password: string) => {
    const loginReq = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (loginReq.ok) {
      const userData: LoginResponse = await loginReq.json();
      setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        roles: userData.roles,
      });
      setJwt(userData.jwt);
      console.log("userData", userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, jwt, setUser }}>
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
