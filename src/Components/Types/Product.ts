export interface Characteristic {
  name: string;
  value: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  characteristics: Characteristic[];
  isLiked: boolean;
}

export type ProductFormData = Omit<IProduct, "id" | "isLiked">;
