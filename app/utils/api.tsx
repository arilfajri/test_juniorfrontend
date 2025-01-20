const API_URL = "https://678dc4baa64c82aeb11dde3d.mockapi.io";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/commerce`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

export const createProduct = async (
  data: Omit<Product, "id" | "createdAt">
): Promise<void> => {
  const existingProducts = await getAllProducts();
  if (existingProducts.length >= 100) {
    await deleteOldestProduct(); // Hapus produk lama jika sudah mencapai batas
  }

  const response = await fetch(`${API_URL}/commerce`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }
};

export const updateProduct = async (
  id: string,
  data: Omit<Product, "id" | "createdAt">
): Promise<void> => {
  const response = await fetch(`${API_URL}/commerce/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/commerce/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
};

export const deleteOldestProduct = async (): Promise<void> => {
  const existingProducts = await getAllProducts();
  if (existingProducts.length > 0) {
    const oldestProduct = existingProducts.reduce((prev, curr) =>
      Number(prev.id) < Number(curr.id) ? prev : curr
    );

    await deleteProduct(oldestProduct.id);
  }
};
