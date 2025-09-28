import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  setUser?: (user: User) => void;
  login: (email: string, password: string) => Promise<LoginResult>; // <-- changer boolean en LoginResult
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  userId: string;
  email: string;
  role?: string;
  exp?: number;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        setUser({
          id: decoded.userId,
          email: decoded.email,
          name: decoded.email?.split("@")[0] || "Unknown",
          role: (decoded.role as "admin" | "analyst" | "user") || "user",
        });
      } catch (err) {
        console.error("Token invalide :", err);
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  // ---------- LOGIN ----------
  const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Login failed" };
    }

    setUser(data.user);
    localStorage.setItem("securecore_user", JSON.stringify(data.user));
    localStorage.setItem("auth_token", data.token);

    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Une erreur est survenue." };
  }
};




  // ---------- REGISTER ----------
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Register failed:", errorData);
        return false;
      }

      // Après register réussi, on peut auto-login
      const loginResult = await login(email, password);
      return loginResult.success;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAuthenticated: !!user }}>

      {children}
    </AuthContext.Provider>
  );
};
