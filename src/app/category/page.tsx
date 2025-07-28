"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import React from "react";
import { useCategoryStore } from "./store";

const mockProducts = [
  { name: "Modern Sofa", price: 1299, image: "/img/cardimg.png" },
  { name: "Classic Sectional", price: 1899, image: "/img/cardimg.png" },
  { name: "Minimalist Coffee Table", price: 399, image: "/img/cardimg.png" },
  { name: "Elegant End Table", price: 199, image: "/img/cardimg.png" },
  { name: "Contemporary TV Stand", price: 599, image: "/img/cardimg.png" },
  { name: "Cozy Armchair", price: 499, image: "/img/cardimg.png" },
  { name: "Modular Sofa", price: 1499, image: "/img/cardimg.png" },
  { name: "L-Shaped Sectional", price: 2099, image: "/img/cardimg.png" },
  { name: "Round Coffee Table", price: 449, image: "/img/cardimg.png" },
  { name: "Side Table", price: 229, image: "/img/cardimg.png" },
  { name: "Floating TV Stand", price: 649, image: "/img/cardimg.png" },
  { name: "Reclining Armchair", price: 549, image: "/img/cardimg.png" },
];

const PRODUCTS_PER_PAGE = 8;

const Category = () => {
  const selectedCategory = useCategoryStore((s) => s.selectedCategory);
  const layout = useCategoryStore((s) => s.layout);
  const setLayout = useCategoryStore((s) => s.setLayout);
  const currentPage = useCategoryStore((s) => s.currentPage);
  const setCurrentPage = useCategoryStore((s) => s.setCurrentPage);

  // Pagination logic
  const totalPages = Math.ceil(mockProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = mockProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="category-page" style={{ padding: "40px 0" }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" style={{ marginBottom: 24 }}>
          <span style={{ color: "#96734f" }}>Furniture</span> /{" "}
          <span style={{ color: "#1c140d", fontWeight: 600 }}>
            {selectedCategory || "Category"}
          </span>
        </nav>
        {/* Title and Layout Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            {selectedCategory || "Category"} Furniture
          </h1>
          <div>
            <button
              onClick={() => setLayout("grid")}
              style={{
                marginRight: 8,
                fontWeight: layout === "grid" ? 700 : 400,
              }}
            >
              &#9634;
            </button>
            <button
              onClick={() => setLayout("list")}
              style={{ fontWeight: layout === "list" ? 700 : 400 }}
            >
              &#9776;
            </button>
          </div>
        </div>
        {/* Products */}
        <div
          className={layout === "grid" ? "products-grid" : "products-list"}
          style={{
            display: "grid",
            gridTemplateColumns:
              layout === "grid"
                ? "repeat(auto-fit, minmax(220px, 1fr))"
                : "1fr",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {paginatedProducts.map((product, idx) => (
            <div
              key={idx}
              className="product-card"
              style={{
                borderRadius: 16,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                padding: 16,
                display: "flex",
                flexDirection: layout === "grid" ? "column" : "row",
                alignItems: layout === "grid" ? "start" : "center",
                gap: 16,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: layout === "grid" ? "100%" : 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>
                  {product.name}
                </div>
                <div
                  style={{ color: "#96734f", fontWeight: 500, marginTop: 4 }}
                >
                  ${product.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #e5e8eb",
              background: "#fff",
            }}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid #e5e8eb",
                background: currentPage === i + 1 ? "#96734f" : "#fff",
                color: currentPage === i + 1 ? "#fff" : "#1c140d",
                fontWeight: currentPage === i + 1 ? 700 : 400,
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "1px solid #e5e8eb",
              background: "#fff",
            }}
          >
            {">"}
          </button>
        </div>
      </main>
    </ClientLayout>
  );
};

export default Category;
