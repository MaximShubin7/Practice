import type { IProduct } from "../Components/Types/Product";

const API_URL = "http://localhost:3002";

class ProductService {
  async getAll(): Promise<IProduct[]> {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Ошибка загрузки товаров");
    }
    return response.json();
  }

  async getById(id: string): Promise<IProduct | null> {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Ошибка загрузки товара");
    }
    return response.json();
  }

  async add(product: Omit<IProduct, "id">): Promise<IProduct> {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error("Ошибка добавления товара");
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Ошибка удаления товара");
    }
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Ошибка обновления товара");
    }
    return response.json();
  }
}

export const productService = new ProductService();
