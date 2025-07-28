"use client";

import "../i18n";
import { useTranslation } from "react-i18next";
import ClientLayout from "../components/layout/ClientLayout";

export default function Home() {
  const { t } = useTranslation();

  const featuredCollections = [
    {
      title: "The Living Room Edit",
      description:
        "Create a cozy and inviting living space with our curated collection of sofas, coffee tables, and more.",
      image: "/img/cardimg.png",
    },
    {
      title: "The Bedroom Refresh",
      description:
        "Transform your bedroom into a relaxing retreat with our stylish beds, nightstands, and bedding.",
      image: "/img/cardimg.png",
    },
    {
      title: "The Dining Room Update",
      description:
        "Elevate your dining experience with our elegant tables, chairs, and tableware.",
      image: "/img/cardimg.png",
    },
  ];

  const categories = [
    { name: "Sofas", image: "/img/cardimg.png" },
    { name: "Beds", image: "/img/cardimg.png" },
    { name: "Dining Tables", image: "/img/cardimg.png" },
    { name: "Chairs", image: "/img/cardimg.png" },
    { name: "Storage", image: "/img/cardimg.png" },
    { name: "Decor", image: "/img/cardimg.png" },
  ];

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Find your perfect piece</h1>
            <p>
              Explore our curated collection of furniture and decor to create a
              home you love.
            </p>
          </div>
        </section>

        <section className="featured-collections">
          <div className="container">
            <h2>Featured Collections</h2>
            <div className="collections-grid">
              {featuredCollections.map((collection, index) => (
                <div key={index} className="collection-card">
                  <div className="card-image">
                    <img src={collection.image} alt={collection.title} />
                  </div>
                  <div className="card-content">
                    <h3>{collection.title}</h3>
                    <p>{collection.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="shop-category">
          <div className="container">
            <h2>Shop by Category</h2>
            <div className="category-grid">
              {categories.map((category, index) => (
                <div key={index} className="category-card">
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <h3>{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="new-arrivals">
          <div className="container">
            <h2>New Arrivals</h2>
            <div className="collections-grid">
              {featuredCollections.map((collection, index) => (
                <div key={index} className="collection-card">
                  <div className="card-image">
                    <img src={collection.image} alt={collection.title} />
                  </div>
                  <div className="card-content">
                    <h3>{collection.title}</h3>
                    <p>{collection.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </ClientLayout>
  );
}
