"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  getCategories,
} from "@/lib/api/products";

import type { Product, Category } from "@/types/products";

interface UseProductsReturn {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  isSearching: boolean;
  total: number;
  query: string;
  selectedCategory: string;
  setQuery: (q: string) => void;
  setSelectedCategory: (c: string) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useProducts(limit = 20, initialSkip = 0): UseProductsReturn {
  const PAGE_SIZE = limit;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(initialSkip);
  const [query, setQueryState] = useState("");
  const [selectedCategory, setSelectedCategoryState] = useState("");

  // Fetch categories once
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  // Fetch products when query or category changes
  const fetchProducts = useCallback(
    async (
      searchQuery: string,
      category: string,
      currentSkip: number,
      append: boolean,
    ) => {
      try {
        if (currentSkip === 0) setIsLoading(true);
        else setIsSearching(true);

        let result;

        if (searchQuery.trim()) {
          result = await searchProducts(searchQuery);
        } else if (category) {
          result = await getProductsByCategory(category);
        } else {
          result = await getProducts(PAGE_SIZE, currentSkip);
        }

        setTotal(result.total);
        setProducts((prev) =>
          append ? [...prev, ...result.products] : result.products,
        );
      } catch {
        // Silently fail — empty state handles the UI
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [],
  );

  // Re-fetch on query/category change
  useEffect(() => {
    setSkip(0);
    fetchProducts(query, selectedCategory, 0, false);
  }, [query, selectedCategory, fetchProducts]);

  const setQuery = (q: string) => {
    setQueryState(q);
    setSelectedCategoryState("");
  };

  const setSelectedCategory = (c: string) => {
    setSelectedCategoryState(c);
    setQueryState("");
  };

  const loadMore = () => {
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    fetchProducts(query, selectedCategory, nextSkip, true);
  };

  const hasMore = !query && !selectedCategory && products.length < total;

  return {
    products,
    categories,
    isLoading,
    isSearching,
    total,
    query,
    selectedCategory,
    setQuery,
    setSelectedCategory,
    loadMore,
    hasMore,
  };
}
