"use client";

import { useState, useEffect } from "react";
import API from "../API";
import { fetchWithCache } from "@/utils/requestCache";

export interface GlobalImage {
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

export interface DefaultSeo {
  id: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export interface SocialMediaLinks {
  id: number;
  Instagram: string;
  Telegram: string;
  YouTobe: string;
  Email: string;
}

export interface PhoneNumbers {
  id: number;
  tel1: string;
  tel2: string;
}

export interface Global {
  id: number;
  documentId: string;
  siteName: string;
  siteDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  favicon: GlobalImage;
  heroImage?: GlobalImage | GlobalImage[];
  seoImg?: GlobalImage;
  defaultSeo: DefaultSeo;
  Social_Media_Links: SocialMediaLinks;
  Phone_Numbers: PhoneNumbers;
}

export interface GlobalsResponse {
  data: Global;
  meta: Record<string, unknown>;
}

export const useGetGlobals = () => {
  const [data, setData] = useState<GlobalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchGlobals = async () => {
      try {
        if (!isMounted) return;

        setLoading(true);
        setError(null);
        const response = await fetchWithCache(
          "globals?populate=deep",
          () =>
            API.get(
              "/api/global?populate[0]=favicon&populate[1]=heroImage&populate[2]=defaultSeo&populate[3]=Social_Media_Links&populate[4]=Phone_Numbers&populate[5]=seoImg",
              {
                signal: controller.signal,
              }
            ).then((r) => r),
          5 * 60 * 1000
        );

        if (!isMounted) return;

        setData(response.data);
      } catch (error: unknown) {
        if (!isMounted) return;

        const maybe = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          maybe.response?.data?.message ||
          maybe.message ||
          "Failed to fetch global settings";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGlobals();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { data, loading, error };
};

export const useGetSiteInfo = () => {
  const { data, loading, error } = useGetGlobals();

  return {
    siteName: data?.data?.siteName,
    siteDescription: data?.data?.siteDescription,
    favicon: data?.data?.favicon,
    heroImage: data?.data?.heroImage,
    seoImg: data?.data?.seoImg,
    defaultSeo: data?.data?.defaultSeo,
    loading,
    error,
  };
};

export const useGetSocialMediaLinks = () => {
  const { data, loading, error } = useGetGlobals();

  return {
    socialMedia: data?.data?.Social_Media_Links,
    loading,
    error,
  };
};

export const useGetPhoneNumbers = () => {
  const { data, loading, error } = useGetGlobals();

  return {
    phoneNumbers: data?.data?.Phone_Numbers,
    loading,
    error,
  };
};
