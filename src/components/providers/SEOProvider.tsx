"use client";

import { useEffect } from "react";
import { useGetSiteInfo } from "@/hooks/getGlobals";

interface SEOProviderProps {
  children: React.ReactNode;
}

export default function SEOProvider({ children }: SEOProviderProps) {
  const { defaultSeo, siteName, siteDescription, seoImg } = useGetSiteInfo();

  useEffect(() => {
    // Update document title
    if (defaultSeo?.metaTitle) {
      document.title = defaultSeo.metaTitle;
    } else if (siteName) {
      document.title = siteName;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', defaultSeo?.metaDescription || siteDescription || '');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = defaultSeo?.metaDescription || siteDescription || '';
      document.head.appendChild(newMetaDescription);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && defaultSeo?.keywords) {
      metaKeywords.setAttribute('content', defaultSeo.keywords);
    } else if (defaultSeo?.keywords) {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = defaultSeo.keywords;
      document.head.appendChild(newMetaKeywords);
    }

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', defaultSeo?.metaTitle || siteName || 'Mabel');
    }

    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', defaultSeo?.metaDescription || siteDescription || '');
    }

    // Update Open Graph image
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
