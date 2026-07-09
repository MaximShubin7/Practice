import { authService } from "./AuthService";

const API_URL = "http://localhost:3001";

interface Characteristic {
  name: string;
  value: string;
}

interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  characteristics: Characteristic[];
  isLiked: boolean;
}

class ProductService {
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

  async getAll(): Promise<IProduct[]> {
    const response = await this.fetchWithAuth(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Ошибка загрузки товаров");
    }
    return response.json();
  }

  async getById(id: string): Promise<IProduct | null> {
    const response = await this.fetchWithAuth(`${API_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Ошибка загрузки товара");
    }
    return response.json();
  }

  async add(product: Omit<IProduct, "id" | "isLiked">): Promise<IProduct> {
    const response = await this.fetchWithAuth(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        ...product,
        isLiked: false,
      }),
    });
    if (!response.ok) {
      throw new Error("Ошибка добавления товара");
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await this.fetchWithAuth(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Ошибка удаления товара");
    }
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const response = await this.fetchWithAuth(`${API_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Ошибка обновления товара");
    }
    return response.json();
  }

  async toggleLike(id: string): Promise<IProduct> {
    const product = await this.getById(id);
    if (!product) {
      throw new Error("Товар не найден");
    }
    const updated = { ...product, isLiked: !product.isLiked };
    return this.update(id, updated);
  }
}

export const productService = new ProductService();
