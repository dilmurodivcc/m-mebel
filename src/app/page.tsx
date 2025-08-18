"use client";

import "../i18n";
import { useTranslation } from "react-i18next";
import ClientLayout from "../components/layout/ClientLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetProducts } from "@/hooks/getProducts";
import { useGetCategories } from "@/hooks/getCategories";
import { useGetSiteInfo } from "@/hooks/getGlobals";
import { formatPriceNumber, getImageUrl } from "@/utils/formatPrice";
import { SkeletonGrid } from "@/components/ui/SkeletonLoader";

// Extend Window interface for setNavigationLoading
declare global {
  interface Window {
    setNavigationLoading?: (loading: boolean) => void;
  }
}

export const dynamic = "force-dynamic";

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // API hooks
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

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get products from API
  const products = productsData?.data || [];

  // New arrivals products (last 3 products from the API)
  const newArrivalsProducts = products.slice(-4);

  // Featured products (first 3 products from the API)
  const featuredProducts = products.slice(0, 4);

  // Get categories from API
  const categories = categoriesData?.data || [];

  useEffect(() => {
    router.prefetch("/category");
    // Prefetch product pages for better performance
    newArrivalsProducts.forEach((product) => {
      router.prefetch(`/product/${product.documentId}`);
    });
    // Prefetch featured product pages
    featuredProducts.forEach((product) => {
      router.prefetch(`/product/${product.documentId}`);
    });
  }, [router, newArrivalsProducts, featuredProducts]);

  const handleProductClick = () => {
    // Use setTimeout to make navigation loading non-blocking
    setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.setNavigationLoading) {
          window.setNavigationLoading(true);
        }
      } catch {}
    }, 0);
  };

  // Loading state
  if (productsLoading || categoriesLoading || siteInfoLoading) {
    return (
      <ClientLayout showHeader={true} showFooter={true}>
        <main className="home-page">
          <section className="hero-section">
            <div className="hero-content fallback">
              <div className="container">
                <h1 suppressHydrationWarning>
                  {isClient ? t("heroTitle") : "Loading..."}
                </h1>
                <p suppressHydrationWarning>
                  {isClient ? t("heroSubtitle") : "Loading..."}
                </p>
              </div>
            </div>
          </section>

          <section className="featured-collections">
            <div className="container">
              <h2 suppressHydrationWarning>
                {isClient ? t("featuredCollections") : "Loading..."}
              </h2>
              <div className="collections-grid">
                <SkeletonGrid count={4} type="collection" />
              </div>
            </div>
          </section>

          <section className="shop-category">
            <div className="container">
              <h2 suppressHydrationWarning>
                {isClient ? t("shopByCategory") : "Loading..."}
              </h2>
              <div className="category-grid">
                <SkeletonGrid count={6} type="category" />
              </div>
            </div>
          </section>

          <section className="new-arrivals">
            <div className="container">
              <h2 suppressHydrationWarning>
                {isClient ? t("newArrivals") : "Loading..."}
              </h2>
              <div className="collections-grid">
                <SkeletonGrid count={4} type="collection" />
              </div>
            </div>
          </section>
        </main>
      </ClientLayout>
    );
  }

  // Error state
  if (productsError || categoriesError || siteInfoError) {
    return (
      <ClientLayout showHeader={true} showFooter={true}>
        <main className="home-page">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h2 className="empty-title">Error loading data</h2>
            <p className="empty-description">
              {productsError && `Products error: ${productsError}`}
              {categoriesError && `Categories error: ${categoriesError}`}
              {siteInfoError && `Site info error: ${siteInfoError}`}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="primary-btn"
              style={{ marginTop: "16px" }}
            >
              Retry
            </button>
          </div>
        </main>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="home-page">
        <section className="hero-section">
          {heroImage ? (
            <>
              <div className="hero-background">
                <img
                  src={getImageUrl(heroImage.url)}
                  alt={heroImage.name || "Hero Image"}
                  className="hero-image"
                />
                <div className="hero-overlay"></div>
              </div>
              <div className="hero-content">
                <div className="container">
                  <h1 suppressHydrationWarning>
                    {isClient ? t("heroTitle") : "Loading..."}
                  </h1>
                  <p suppressHydrationWarning>
                    {isClient ? t("heroSubtitle") : "Loading..."}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="hero-content fallback">
              <div className="container">
                <h1 suppressHydrationWarning>
                  {isClient ? t("heroTitle") : "Loading..."}
                </h1>
                <p suppressHydrationWarning>
                  {isClient ? t("heroSubtitle") : "Loading..."}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="featured-collections">
          <div className="container">
            <h2 suppressHydrationWarning>
              {isClient ? t("featuredCollections") : "Loading..."}
            </h2>
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
                      <img
                        src={getImageUrl(product.img?.url)}
                        alt={product.title}
                        onError={(e) => {
                          e.currentTarget.src = "/img/cardimg.png";
                        }}
                      />
                    </div>
                    <div className="card-content">
                      <h3 suppressHydrationWarning>
                        {isClient ? product.title : "Loading..."}
                      </h3>
                      <p className="product-price">
                        {isClient && product.price
                          ? formatPriceNumber(product.price)
                          : "Loading..."}
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
            <h2 suppressHydrationWarning>
              {isClient ? t("shopByCategory") : "Loading..."}
            </h2>
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
                      <img
                        src={getImageUrl(category.image?.url)}
                        alt={category.name}
                        onError={(e) => {
                          e.currentTarget.src = "/img/cardimg.png";
                        }}
                      />
                    </div>
                    <h3 suppressHydrationWarning>
                      {isClient ? category.name : "Loading..."}
                    </h3>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="new-arrivals">
          <div className="container">
            <h2 suppressHydrationWarning>
              {isClient ? t("newArrivals") : "Loading..."}
            </h2>
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
                      <img
                        src={getImageUrl(product.img?.url)}
                        alt={product.title}
                        onError={(e) => {
                          e.currentTarget.src = "/img/cardimg.png";
                        }}
                      />
                    </div>
                    <div className="card-content">
                      <h3 suppressHydrationWarning>
                        {isClient ? product.title : "Loading..."}
                      </h3>
                      <p className="product-price">
                        {isClient && product.price
                          ? formatPriceNumber(product.price)
                          : "Loading..."}
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
