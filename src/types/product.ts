export interface AddProductPayload {
  name: string;
  categoryId?: number | null;
  description?: string | null;
  discountPrice?: number | null;
  imagesUrls?: string[] | null;
  price: number;
  stockQuantity: number;
}

export interface UpdateProductPayload {
  name?: string;
  categoryId?: number | null;
  description?: string | null;
  discountPrice?: number | null;
  imagesUrls?: string[] | null;
  price?: number;
  stockQuantity?: number;
}
