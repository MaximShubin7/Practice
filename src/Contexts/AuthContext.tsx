import { createContext, type ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "../Components/Hooks/useLocalStorage";
import type { User, AuthContextType } from "./Types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>("users", []);
  const [user, setUser] = useLocalStorage<User | null>("currentUser", null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = users.find((u) => u.email === email);

    if (!foundUser) {
      return { success: false, message: "Пользователь не найден" };
    }

    if (foundUser.password !== password) {
      return { success: false, message: "Неверный пароль" };
    }

    setUser(foundUser);
    return { success: true, message: "Вход выполнен" };
  };

  const register = (userData: Omit<User, "id">) => {
    const existingUser = users.find((u) => u.email === userData.email);

    if (existingUser) {
      return {
        success: false,
        message: "Аккаунт с таким email уже существует",
      };
    }

    const newUser = {
      ...userData,
      id: Date.now(),
    };

    setUsers([...users, newUser]);
    setUser(newUser);
    return { success: true, message: "Регистрация успешна" };
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
