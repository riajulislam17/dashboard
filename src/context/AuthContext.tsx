"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  login: (token: string, userInfo: USER) => void;
  logout: () => void;
  user: USER;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || "authToken";
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<USER>({
    id: 0,
    name: "",
    email: "",
  });
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_NAME);
    const userInfo = localStorage.getItem("USER");
    if (storedToken && userInfo) {
      setToken(storedToken);
      setUser(JSON.parse(userInfo));
    } else {
      router.push("/login");
    }
  }, []);

  const login = (newToken: string, userInfo: USER) => {
    localStorage.setItem(TOKEN_NAME, newToken);
    localStorage.setItem("USER", JSON.stringify(userInfo));
    setToken(newToken);

    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_NAME);
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};
