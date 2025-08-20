"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import API from "../API";
import {
  Product,
  ProductsResponse,
  SingleProductResponse,
} from "./getProducts";

// Helper function to safely get products data
const getProductsData = (data: ProductsResponse | undefined): Product[] => {
  return data?.data || [];
};

// Fetch function for all products
const fetchAllProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await API.get(
      "/api/products?populate[0]=img&populate[1]=detail_img"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    };
  }
};

// Fetch function for products by category slug
const fetchProductsByCategorySlug = async (
  categorySlug: string
): Promise<ProductsResponse> => {
  try {
    const response = await API.get(
      `/api/products?filters[category][slug][$eq]=${categorySlug}&populate[0]=img&populate[1]=detail_img`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category slug:", error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    };
  }
};

// Fetch function for products by multiple category IDs
const fetchProductsByCategoryIds = async (
  categoryIds: number[]
): Promise<ProductsResponse> => {
  if (!categoryIds || categoryIds.length === 0) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    };
  }

  try {
    const categoryFilters = categoryIds
      .map((id, index) => `filters[category][id][$in][${index}]=${id}`)
      .join("&");
    const url = `/api/products?${categoryFilters}&populate[0]=img&populate[1]=detail_img`;

    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products by category IDs:", error);
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } },
    };
  }
};

// Hook for all products
export const useAllProducts = () => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", "all"],
    queryFn: fetchAllProducts,
    enabled: typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount) => {
      // Don't retry on 404 or network errors during SSR
      if (typeof window === "undefined") return false;
      return failureCount < 2;
    },
  });
};

// Hook for products by category slug with keepPreviousData
export const useProductsByCategorySlug = (categorySlug: string) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", "category-slug", categorySlug],
    queryFn: () => fetchProductsByCategorySlug(categorySlug),
    enabled: !!categorySlug && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
    retry: (failureCount) => {
      // Don't retry on 404 or network errors during SSR
      if (typeof window === "undefined") return false;
      return failureCount < 2;
    },
  });
};

// Hook for products by multiple category IDs with keepPreviousData
export const useProductsByCategoryIds = (categoryIds: number[]) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", "category-ids", categoryIds],
    queryFn: () => fetchProductsByCategoryIds(categoryIds),
    enabled: categoryIds.length > 0 && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching new data
    retry: (failureCount) => {
      // Don't retry on 404 or network errors during SSR
      if (typeof window === "undefined") return false;
      return failureCount < 2;
    },
  });
};

// Hook for products by material
export const useProductsByMaterial = (material: string) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", "material", material],
    queryFn: () => {
      return API.get(
        `/api/products?populate[0]=img&populate[1]=detail_img&filters[material][$eq]=${material}`
      ).then((r) => r.data);
    },
    enabled: !!material && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  });
};

// Hook for single product
export const useProduct = (documentId: string) => {
  return useQuery<SingleProductResponse>({
    queryKey: ["product", documentId],
    queryFn: () => {
      return API.get(
        `/api/products/${documentId}?populate[0]=img&populate[1]=detail_img&populate[2]=SizesOfProduct&populate[3]=category`
      ).then((r) => r.data);
    },
    enabled: !!documentId && typeof window !== "undefined",
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Export helper function for safe data access
export { getProductsData };
