import React, { createContext, useState, useEffect,type ReactNode } from "react";

type User = {
  email: string;
  // add other user fields here as needed
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On mount, check localStorage for saved token and user info
  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedUser = localStorage.getItem("user");

    if (savedAccessToken && savedUser) {
      setToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (accessToken: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
