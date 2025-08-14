"use client";

import { useState, useEffect } from "react";
import API from "../API";
import { fetchWithCache } from "@/utils/requestCache";

export interface CategoryImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: null;
  caption: null;
  width: number | null;
  height: number | null;
  formats: {
    thumbnail?: {
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
    small?: {
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
    medium?: {
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
  } | null;
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

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: CategoryImage;
  products?: unknown[];
}

export interface CategoriesResponse {
  data: Category[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleCategoryResponse {
  data: Category;
  meta: Record<string, unknown>;
}

export const useGetCategories = () => {
  const [data, setData] = useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCategories = async () => {
      const now = Date.now();
      if (data && now - lastFetch < 5 * 60 * 1000) {
        setLoading(false);
        return;
      }

      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);
        console.log("Fetching categories...");
        const response = await fetchWithCache(
          "categories?populate=image",
          () =>
            API.get("/api/categories?populate=image", {
              signal: controller.signal,
            }).then((r) => r),
          5 * 60 * 1000
        );

        if (!isMounted) return;

        console.log("Categories response:", response.data);
        setData(response.data);
        setLastFetch(now);
      } catch (error: unknown) {
        if (!isMounted) return;

        console.error("Error fetching categories:", error);
        const maybe = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          maybe.response?.data?.message ||
          maybe.message ||
          "Failed to fetch categories";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [data, lastFetch]);

  return { data, loading, error };
};

export const useGetCategory = (documentId: string) => {
  const [data, setData] = useState<SingleCategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategory = async () => {
      if (!documentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await API.get(
          `/api/categories/${documentId}?populate=image`,
          { signal: controller.signal }
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
          "Failed to fetch category";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    return () => controller.abort();
  }, [documentId]);

  return { data, loading, error };
};

export const useGetCategoriesWithPagination = (
  page: number = 1,
  pageSize: number = 25
) => {
  const [data, setData] = useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get(
          `/api/categories?populate=image&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
          { signal: controller.signal }
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
          "Failed to fetch categories";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    return () => controller.abort();
  }, [page, pageSize]);

  return { data, loading, error };
};

export const useGetCategoryBySlug = (slug: string) => {
  const [data, setData] = useState<SingleCategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCategory = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await API.get(
          `/api/categories?populate=image&filters[slug][$eq]=${slug}`,
          { signal: controller.signal }
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
          "Failed to fetch category";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    return () => controller.abort();
  }, [slug]);

  return { data, loading, error };
};

export const useGetCategoryWithProducts = (slug: string) => {
  const [data, setData] = useState<CategoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCategoryWithProducts = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

          const now = Date.now();
      if (data && now - lastFetch < 5 * 60 * 1000) {
        setLoading(false);
        return;
      }

      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);
        console.log("Fetching category with products:", slug);
        const url = `/api/categories?filters[slug][$eq]=${slug}&populate=products`;
        console.log("API URL:", url);
        console.log(
          "Full API call will be made to:",
          API.defaults.baseURL + url
        );
        const response = await fetchWithCache(
          `category-with-products:${slug}`,
          () => API.get(url, { signal: controller.signal }).then((r) => r),
          5 * 60 * 1000
        );

        if (!isMounted) return;

        console.log("Category with products response:", response.data);
        console.log(
          "Category products count:",
          response.data?.data?.[0]?.products?.length || 0
        );
        setData(response.data);
        setLastFetch(now);
      } catch (error: unknown) {
        if (!isMounted) return;

        console.error("Error fetching category with products:", error);
        const maybe = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          maybe.response?.data?.message ||
          maybe.message ||
          "Failed to fetch category with products";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategoryWithProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, data, lastFetch]);

  return { data, loading, error };
};
