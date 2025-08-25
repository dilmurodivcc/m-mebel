"use client";

import { useTranslation } from "react-i18next";
import ClientLayout from "../components/layout/ClientLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetProducts } from "@/hooks/getProducts";
import { useGetCategories } from "@/hooks/getCategories";
import { useGetSiteInfo } from "@/hooks/getGlobals";
import { formatPriceNumber, getImageUrl } from "@/utils/formatPrice";
import { SkeletonGrid } from "@/components/ui/SkeletonLoader";
import ErrorState from "@/components/ui/ErrorState";
import HeroCarousel from "@/components/ui/HeroCarousel";
import SafeImage from "@/components/ui/SafeImage";

declare global {
  interface Window {
    setNavigationLoading?: (loading: boolean) => void;
  }
}

export const dynamic = "force-dynamic";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useGetProducts();
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useGetCategories();
  const {
    heroImage,
    loading: siteInfoLoading,
    error: siteInfoError,
  } = useGetSiteInfo();

  const products = productsData?.data || [];

  const newArrivalsProducts = products.slice(-4);

  const featuredProducts = products.slice(0, 4);

  const categories = categoriesData?.data || [];

  const getHeroCarouselImages = () => {
    const carouselImages = [];

    // Use all hero images from API if available
    if (heroImage && Array.isArray(heroImage) && heroImage.length > 0) {
      heroImage.forEach((image) => {
        if (image && image.url) {
          carouselImages.push({
            url: image.url,
            name: image.name || "Hero Image",
          });
        }
      });
    } else if (heroImage && !Array.isArray(heroImage) && heroImage.url) {
      // Fallback for single hero image
      carouselImages.push({
        url: heroImage.url,
        name: heroImage.name || "Hero Image",
      });
    }

    // If we still don't have enough images, add fallback images
    while (carouselImages.length < 4) {
      carouselImages.push({
        url: "/img/cardimg.png",
        name: "Featured Furniture",
      });
    }

    return carouselImages.slice(0, 4); // Ensure exactly 4 images
  };

  const heroCarouselImages = getHeroCarouselImages();

  useEffect(() => {
    router.prefetch("/category");
    newArrivalsProducts.forEach((product) => {
      router.prefetch(`/product/${product.documentId}`);
    });
    featuredProducts.forEach((product) => {
      router.prefetch(`/product/${product.documentId}`);
    });
  }, [router, newArrivalsProducts, featuredProducts]);

  const handleProductClick = () => {
    setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.setNavigationLoading) {
          window.setNavigationLoading(true);
        }
      } catch {}
    }, 0);
  };

  // Show error state if there are critical errors
  if (productsError || categoriesError || siteInfoError) {
    // Determine the type of error for better UX
    const getErrorType = () => {
      if (
        productsError?.includes("timeout") ||
        categoriesError?.includes("timeout") ||
        siteInfoError?.includes("timeout")
      ) {
        return "timeout";
      }
      if (
        productsError?.includes("network") ||
        categoriesError?.includes("network") ||
        siteInfoError?.includes("network")
      ) {
        return "network";
      }
      return "error";
    };

    const errorMessages = [
      productsError && `Products: ${productsError}`,
      categoriesError && `Categories: ${categoriesError}`,
      siteInfoError && `Site info: ${siteInfoError}`,
    ]
      .filter(Boolean)
      .join("\n");

    return (
      <ClientLayout showHeader={true} showFooter={true}>
        <main className="home-page">
          <ErrorState
            iconType={getErrorType()}
            error={errorMessages}
            onRetry={() => window.location.reload()}
          />
        </main>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="home-page">
        <section className="hero-section">
          <HeroCarousel
            images={heroCarouselImages}
            autoPlayInterval={3000}
            showIndicators={true}
            showArrows={true}
            loading={siteInfoLoading}
          />
          <div className="hero-content">
            <div className="container">
              <h1 suppressHydrationWarning>{t("heroTitle")}</h1>
              <p suppressHydrationWarning>{t("heroSubtitle")}</p>
            </div>
          </div>
        </section>

        <section className="featured-collections">
          <div className="container">
            <h2 suppressHydrationWarning>{t("featuredCollections")}</h2>
            <div className="collections-grid">
              {productsLoading ? (
                <SkeletonGrid count={4} type="collection" />
              ) : (
                featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.documentId}`}
                    className="collection-card"
                    onClick={handleProductClick}
                    prefetch={true}
                  >
                    <div className="card-image">
                      <SafeImage
                        src={getImageUrl(product.img?.url)}
                        alt={product.title}
                        width={300}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-content">
                      <h3 suppressHydrationWarning>{product.title}</h3>
                      <p className="product-price">
                        {product.price
                          ? formatPriceNumber(product.price)
                          : "N/A"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="shop-category">
          <div className="container">
            <h2 suppressHydrationWarning>{t("shopByCategory")}</h2>
            <div className="category-grid">
              {categoriesLoading ? (
                <SkeletonGrid count={6} type="category" />
              ) : (
                categories.map((category) => (
                  <Link
                    href={`/category?category=${category.slug}`}
                    key={category.id}
                    className="category-card"
                    onClick={handleProductClick}
                  >
                    <div className="category-image">
                      <SafeImage
                        src={getImageUrl(category.image?.url)}
                        alt={category.name}
                        width={300}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <h3 suppressHydrationWarning>{category.name}</h3>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="new-arrivals">
          <div className="container">
            <h2 suppressHydrationWarning>{t("newArrivals")}</h2>
            <div className="collections-grid">
              {productsLoading ? (
                <SkeletonGrid count={4} type="collection" />
              ) : (
                newArrivalsProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.documentId}`}
                    className="collection-card"
                    onClick={handleProductClick}
                    prefetch={true}
                  >
                    <div className="card-image">
                      <SafeImage
                        src={getImageUrl(product.img?.url)}
                        alt={product.title}
                        width={300}
                        height={200}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="card-content">
                      <h3 suppressHydrationWarning>{product.title}</h3>
                      <p className="product-price">
                        {product.price
                          ? formatPriceNumber(product.price)
                          : "N/A"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </ClientLayout>
  );
}
