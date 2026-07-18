import { authService } from "./AuthService";

const API_URL = "http://localhost:3002";

export interface CartItem {
  productId: string;
  quantity: number;
}

class CartService {
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

  async getCart(): Promise<CartItem[]> {
    const userId = this.getUserId();
    const response = await this.fetchWithAuth(`${API_URL}/carts`);
    if (!response.ok) {
      throw new Error("Ошибка загрузки корзины");
    }
    const data = await response.json();
    return data[userId] || [];
  }

  async addToCart(
    productId: string,
    quantity: number = 1,
  ): Promise<CartItem[]> {
    const userId = this.getUserId();

    const currentCart = await this.getCart();
    const existingItem = currentCart.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ productId, quantity });
    }

    const response = await this.fetchWithAuth(`${API_URL}/carts`, {
      method: "PUT",
      body: JSON.stringify({
        [userId]: currentCart,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка добавления в корзину");
    }
    return currentCart;
  }

  async removeFromCart(productId: string): Promise<CartItem[]> {
    const userId = this.getUserId();

    const currentCart = await this.getCart();
    const updatedCart = currentCart.filter(
      (item) => item.productId !== productId,
    );

    const response = await this.fetchWithAuth(`${API_URL}/carts`, {
      method: "PUT",
      body: JSON.stringify({
        [userId]: updatedCart,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка удаления из корзины");
    }
    return updatedCart;
  }

  async updateQuantity(
    productId: string,
    quantity: number,
  ): Promise<CartItem[]> {
    const userId = this.getUserId();

    const currentCart = await this.getCart();
    const updatedCart = currentCart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );

    const response = await this.fetchWithAuth(`${API_URL}/carts`, {
      method: "PUT",
      body: JSON.stringify({
        [userId]: updatedCart,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка обновления количества");
    }
    return updatedCart;
  }
}

export const cartService = new CartService();
