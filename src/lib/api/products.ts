import type { Product, ProductsResponse, Category } from "@/types/products";

const BASE_URL = "https://dummyjson.com";

export async function getProducts(
  limit = 20,
  skip = 0,
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,price,discountPercentage,rating,stock,brand,category,thumbnail`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&select=id,title,price,discountPercentage,rating,stock,brand,category,thumbnail`,
  );
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}

export async function getProductsByCategory(
  category: string,
): Promise<ProductsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}?select=id,title,price,discountPercentage,rating,stock,brand,category,thumbnail`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export function getDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  return parseFloat((price * (1 - discountPercentage / 100)).toFixed(2));
}
