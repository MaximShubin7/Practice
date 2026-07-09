import { createContext, type ReactNode, useState, useEffect } from "react";
import { authService } from "../Services/AuthService";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  password: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: Omit<User, "id">,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const token = await authService.refreshTokenRequest();
        if (!token) {
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: userData } = await authService.login(email, password);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, message: "Вход выполнен" };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  };

  const register = async (userData: Omit<User, "id">) => {
    try {
      const { user: newUser } = await authService.register(userData);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true, message: "Регистрация успешна" };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("user");
  };

  const refreshToken = async (): Promise<string | null> => {
    return authService.refreshTokenRequest();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
