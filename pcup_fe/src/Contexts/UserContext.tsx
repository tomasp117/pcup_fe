import React, { useEffect, useState } from "react";
import { createContext } from "react";

type User = {
  username: string;
  role: string;
} | null;

type UserContextValue = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token) {
    //   try {
    //     const decoded = JSON.parse(atob(token.split(".")[1]));
    //     setUser({ username: decoded.unique_name, role: decoded.role });
    //   } catch (error) {
    //     console.error("Chyba při dekódování tokenu", error);
    //     localStorage.removeItem("token");
    //   }
    // }
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        // 1) Base64URL → Base64
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        // 2) atob → binární string
        const binary = atob(base64);
        // 3) String → Uint8Array bajtů
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        // 4) UTF-8 decode
        const decoded = new TextDecoder().decode(bytes);
        const payload = JSON.parse(decoded);
        setUser({ username: payload.unique_name, role: payload.role });
      } catch (error) {
        console.error("Chyba při dekódování tokenu", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
