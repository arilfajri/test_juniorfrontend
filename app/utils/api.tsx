export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

const API_URL = "https://678dc4baa64c82aeb11dde3d.mockapi.io/commerce";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const createProduct = async (product: Product): Promise<Product> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to create product");
  return response.json();
};

export const updateProduct = async (
  id: string,
  product: Product
): Promise<Product> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete product");
};
