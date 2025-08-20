"use client";

import { useEffect } from "react";
import { useGetSiteInfo } from "@/hooks/getGlobals";

interface SEOProviderProps {
  children: React.ReactNode;
}

export default function SEOProvider({ children }: SEOProviderProps) {
  const { defaultSeo, siteName, siteDescription, seoImg } = useGetSiteInfo();

  useEffect(() => {
    if (defaultSeo?.metaTitle) {
      document.title = defaultSeo.metaTitle;
    } else if (siteName) {
      document.title = siteName;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', defaultSeo?.metaDescription || siteDescription || '');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = defaultSeo?.metaDescription || siteDescription || '';
      document.head.appendChild(newMetaDescription);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && defaultSeo?.keywords) {
      metaKeywords.setAttribute('content', defaultSeo.keywords);
    } else if (defaultSeo?.keywords) {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = defaultSeo.keywords;
      document.head.appendChild(newMetaKeywords);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', defaultSeo?.metaTitle || siteName || 'Mabel');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', defaultSeo?.metaDescription || siteDescription || '');
    }

    if (seoImg?.url) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', seoImg.url);
      } else {
        const newOgImage = document.createElement('meta');
        newOgImage.setAttribute('property', 'og:image');
        newOgImage.setAttribute('content', seoImg.url);
        document.head.appendChild(newOgImage);
      }
    }
  }, [defaultSeo, siteName, siteDescription, seoImg]);

  return <>{children}</>;
}
