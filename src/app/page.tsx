"use client";

import "../i18n";
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
                <h1>{t("heroTitle")}</h1>
                <p>{t("heroSubtitle")}</p>
              </div>
            </div>
          </section>

          <section className="featured-collections">
            <div className="container">
              <h2>{t("featuredCollections")}</h2>
              <div className="collections-grid">
                <SkeletonGrid count={4} type="collection" />
              </div>
            </div>
          </section>

          <section className="shop-category">
            <div className="container">
              <h2>{t("shopByCategory")}</h2>
              <div className="category-grid">
                <SkeletonGrid count={6} type="category" />
              </div>
            </div>
          </section>

          <section className="new-arrivals">
            <div className="container">
              <h2>{t("newArrivals")}</h2>
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
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Error loading data</h2>
            {productsError && <p>Products error: {productsError}</p>}
            {categoriesError && <p>Categories error: {categoriesError}</p>}
            {siteInfoError && <p>Site info error: {siteInfoError}</p>}
            <button onClick={() => window.location.reload()}>Retry</button>
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
                  <h1>{t("heroTitle")}</h1>
                  <p>{t("heroSubtitle")}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="hero-content fallback">
              <div className="container">
                <h1>{t("heroTitle")}</h1>
                <p>{t("heroSubtitle")}</p>
              </div>
            </div>
          )}
        </section>

        <section className="featured-collections">
          <div className="container">
            <h2>{t("featuredCollections")}</h2>
            <div className="collections-grid">
              {productsLoading ? (
                <SkeletonGrid count={3} type="collection" />
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
                      />
                    </div>
                    <div className="card-content">
                      <h3>{product.title}</h3>
                      <p className="product-price">
                        {formatPriceNumber(product.price)}
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
            <h2>{t("shopByCategory")}</h2>
            <div className="category-grid">
              {categoriesLoading ? (
                <SkeletonGrid count={6} type="category" />
              ) : (
                categories.map((category) => (
                  <Link
                    href={`/category?category=${category.slug}`}
                    key={category.id}
                    className="category-card"
                  >
                    <div className="category-image">
                      <img
                        src={getImageUrl(category.image?.url)}
                        alt={category.name}
                      />
                    </div>
                    <h3>{category.name}</h3>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="new-arrivals">
          <div className="container">
            <h2>{t("newArrivals")}</h2>
            <div className="collections-grid">
              {productsLoading ? (
                <SkeletonGrid count={3} type="collection" />
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
                      />
                    </div>
                    <div className="card-content">
                      <h3>{product.title}</h3>
                      <p className="product-price">
                        {formatPriceNumber(product.price)}
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
