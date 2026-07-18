import { authService } from "./AuthService";

const API_URL = "http://localhost:3002";

class FavoritesService {
  private async fetchWithAuth(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const token = authService.getAccessToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      const newToken = await authService.refreshTokenRequest();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    return response;
  }

  private getUserId(): string {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id || "guest";
  }

  async getFavorites(): Promise<string[]> {
    const userId = this.getUserId();
    const response = await this.fetchWithAuth(`${API_URL}/favorites`);
    if (!response.ok) {
      throw new Error("Ошибка загрузки избранного");
    }
    const data = await response.json();
    return data[userId] || [];
  }

  async addFavorite(productId: string): Promise<string[]> {
    const userId = this.getUserId();

    const currentFavorites = await this.getFavorites();
    if (!currentFavorites.includes(productId)) {
      currentFavorites.push(productId);
    }

    const response = await this.fetchWithAuth(`${API_URL}/favorites`, {
      method: "PUT",
      body: JSON.stringify({
        [userId]: currentFavorites,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка добавления в избранное");
    }
    return currentFavorites;
  }

  async removeFavorite(productId: string): Promise<string[]> {
    const userId = this.getUserId();

    const currentFavorites = await this.getFavorites();
    const updatedFavorites = currentFavorites.filter(
      (id: string) => id !== productId,
    );

    const response = await this.fetchWithAuth(`${API_URL}/favorites`, {
      method: "PUT",
      body: JSON.stringify({
        [userId]: updatedFavorites,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка удаления из избранного");
    }
    return updatedFavorites;
  }

  async toggleFavorite(productId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const isLiked = favorites.includes(productId);

    if (isLiked) {
      await this.removeFavorite(productId);
      return false;
    } else {
      await this.addFavorite(productId);
      return true;
    }
  }
}

export const favoritesService = new FavoritesService();
