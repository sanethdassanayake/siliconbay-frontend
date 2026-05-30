import { Product } from "@/types/product";

const API_BASE = "/api/products";

export const productService = {
  async getFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/featured`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) throw new Error("Failed to fetch featured products");

    const data = await response.json();
    return data.products || [];
  },

  async getBestSellerProducts(): Promise<Product[]> {
    const response = await fetch(`/api/backend/products/best-sellers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch best seller products");

    const data = await response.json();
    return data.products || [];
  },

  async getProductById(id: string | number): Promise<Product | null> {
    const response = await fetch(`/api/backend/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.product || data || null;
  },


};
