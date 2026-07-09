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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
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
