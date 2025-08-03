"use client";

import "../i18n";
import { useTranslation } from "react-i18next";
import ClientLayout from "../components/layout/ClientLayout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";

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

  // New arrivals products (last 3 products from the products array)
  const newArrivalsProducts = products.slice(-3);

  useEffect(() => {
    router.prefetch("/category");
    // Prefetch product pages for better performance
    newArrivalsProducts.forEach((product) => {
      router.prefetch(`/product/${product.id}`);
    });
  }, [router, newArrivalsProducts]);

  const handleProductClick = () => {
    // Use setTimeout to make navigation loading non-blocking
    setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.setNavigationLoading) {
          window.setNavigationLoading(true);
        }
      } catch {
        console.log("Navigation loading not available");
      }
    }, 0);
  };

  const featuredCollections = [
    {
      title: "livingRoomEdit",
      description: "livingRoomDescription",
      image: "/img/cardimg.png",
    },
    {
      title: "bedroomRefresh",
      description: "bedroomDescription",
      image: "/img/cardimg.png",
    },
    {
      title: "diningRoomUpdate",
      description: "diningRoomDescription",
      image: "/img/cardimg.png",
    },
  ];

  const categories = [
    { name: "sofas", image: "/img/cardimg.png" },
    { name: "sectionals", image: "/img/cardimg.png" },
    { name: "coffeeTables", image: "/img/cardimg.png" },
    { name: "endTables", image: "/img/cardimg.png" },
    { name: "tvStands", image: "/img/cardimg.png" },
    { name: "armchairs", image: "/img/cardimg.png" },
  ];

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroSubtitle")}</p>
          </div>
        </section>

        <section className="featured-collections">
          <div className="container">
            <h2>{t("featuredCollections")}</h2>
            <div className="collections-grid">
              {featuredCollections.map((collection, index) => (
                <div key={index} className="collection-card">
                  <div className="card-image">
                    <img src={collection.image} alt={t(collection.title)} />
                  </div>
                  <div className="card-content">
                    <h3>{t(collection.title)}</h3>
                    <p>{t(collection.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="shop-category">
          <div className="container">
            <h2>{t("shopByCategory")}</h2>
            <div className="category-grid">
              {categories.map((category, index) => (
                <Link href={`/category`} key={index} className="category-card">
                  <div className="category-image">
                    <img src={category.image} alt={t(category.name)} />
                  </div>
                  <h3>{t(category.name)}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="new-arrivals">
          <div className="container">
            <h2>{t("newArrivals")}</h2>
            <div className="collections-grid">
              {newArrivalsProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="collection-card"
                  onClick={handleProductClick}
                  prefetch={true}
                >
                  <div className="card-image">
                    <img
                      src={product.image}
                      alt={t(product.name.toLowerCase().replace(/\s+/g, ""))}
                    />
                  </div>
                  <div className="card-content">
                    <h3>{t(product.name.toLowerCase().replace(/\s+/g, ""))}</h3>
                    <p className="product-price">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </ClientLayout>
  );
}
