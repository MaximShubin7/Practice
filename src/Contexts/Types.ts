export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  password: string;
  role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; message: string };
  register: (userData: Omit<User, "id">) => {
    success: boolean;
    message: string;
  };
  logout: () => void;
}
