"use client";

import { useState, useEffect } from "react";
import API from "../API";
import { fetchWithCache } from "@/utils/requestCache";

export interface ProductImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: {
    thumbnail: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    small: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    medium: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
    large: {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: null;
      width: number;
      height: number;
      size: number;
      sizeInBytes: number;
      url: string;
    };
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ProductSize {
  id: number;
  height: string;
  width: number;
  depth: number;
}

export interface Product {
  id: number;
  documentId: string;
  title: string;
  price: number;
  add_date: string;
  quantity: string;
  disc_price: number;
  delivery: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  material: string;
  img?: ProductImage;
  detail_img?: ProductImage[];
  SizesOfProduct?: ProductSize;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleProductResponse {
  data: Product;
  meta: Record<string, unknown>;
}

// Hook for getting all products
export const useGetProducts = () => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      // Cache for 2 minutes for faster updates
      const now = Date.now();
      if (data && now - lastFetch < 2 * 60 * 1000) {
        setLoading(false);
        return;
      }

      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);
        const response = await fetchWithCache(
          "products?populate[0]=img&populate[1]=detail_img",
          () =>
            API.get("/api/products?populate[0]=img&populate[1]=detail_img", {
              signal: controller.signal,
            }).then((r) => r),
          2 * 60 * 1000 // Reduced cache time
        );

        if (!isMounted) return;

        setData(response.data);
        setLastFetch(now);
      } catch (error: unknown) {
        if (!isMounted) return;

        const maybe = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          maybe.response?.data?.message ||
          maybe.message ||
          "Failed to fetch products";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [data, lastFetch]);

  return { data, loading, error };
};

export const useGetProduct = (documentId: string) => {
  const [data, setData] = useState<SingleProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProduct = async () => {
      if (!documentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchWithCache(
          `product:${documentId}`,
          () =>
            API.get(
              `/api/products/${documentId}?populate[0]=img&populate[1]=detail_img&populate[2]=SizesOfProduct&populate[3]=category`,
              {
                signal: controller.signal,
              }
            ).then((r) => r),
          5 * 60 * 1000
        );
        setData(response.data);
      } catch (error: unknown) {
        const maybe = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          maybe.response?.data?.message ||
          maybe.message ||
          "Failed to fetch product";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [documentId]);

  return { data, loading, error };
};

export const useGetProductsWithPagination = (
  page: number = 1,
  pageSize: number = 25
) => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(
          `/api/products?populate[0]=img&populate[1]=detail_img&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        );
        setData(response.data);
      } catch (error: unknown) {
        const errorMessage =
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          ).response?.data?.message ||
          (error as { message?: string }).message ||
          "Failed to fetch products";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize]);

  return { data, loading, error };
};

export const useGetProductsByMaterial = (material: string) => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      if (!material) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchWithCache(
          `products-by-material:${material}`,
          () =>
            API.get(
              `/api/products?populate[0]=img&populate[1]=detail_img&filters[material][$eq]=${material}`,
              { signal: controller.signal }
            ).then((r) => r),
          5 * 60 * 1000
        );
        setData(response.data);
      } catch (error: unknown) {
        const maybe = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          maybe.response?.data?.message ||
          maybe.message ||
          "Failed to fetch products";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [material]);

  return { data, loading, error };
};

export const useGetProductsByCategorySlug = (categorySlug: string) => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      if (!categorySlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const url = `/api/products?filters[category][slug][$eq]=${categorySlug}&populate[0]=img&populate[1]=detail_img`;
        const response = await fetchWithCache(
          `products-by-category:${categorySlug}`,
          () => API.get(url, { signal: controller.signal }).then((r) => r),
          5 * 60 * 1000
        );
        setData(response.data);
      } catch (error: unknown) {
        const errorMessage =
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          ).response?.data?.message ||
          (error as { message?: string }).message ||
          "Failed to fetch products by category";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [categorySlug]);

  return { data, loading, error };
};

export const useGetProductsByCategoryIds = (categoryIds: number[]) => {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      if (!categoryIds || categoryIds.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const categoryFilters = categoryIds
          .map((id, index) => `filters[category][id][$in][${index}]=${id}`)
          .join("&");
        const url = `/api/products?${categoryFilters}&populate[0]=img&populate[1]=detail_img`;

        const response = await fetchWithCache(
          `products-by-category-ids:${categoryIds.join(",")}`,
          () => API.get(url, { signal: controller.signal }).then((r) => r),
          5 * 60 * 1000
        );
        setData(response.data);
      } catch (error: unknown) {
        const errorMessage =
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          ).response?.data?.message ||
          (error as { message?: string }).message ||
          "Failed to fetch products by category IDs";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [categoryIds]);

  return { data, loading, error };
};
