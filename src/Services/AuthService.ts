const API_URL = "http://localhost:3001";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

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

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  private saveTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem("accessToken");
  }

  getRefreshToken(): string | null {
    return this.refreshToken || localStorage.getItem("refreshToken");
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Неверный логин или пароль");
    }

    const data = await response.json();
    this.saveTokens(data.tokens);
    return { user: data.user, tokens: data.tokens };
  }

  async register(userData: Omit<User, "id">) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Ошибка регистрации");
    }

    const data = await response.json();
    this.saveTokens(data.tokens);
    return { user: data.user, tokens: data.tokens };
  }

  async refreshTokenRequest(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      this.saveTokens(data.tokens);
      return data.tokens.accessToken;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout() {
    this.clearTokens();
  }
}

export const authService = new AuthService();
