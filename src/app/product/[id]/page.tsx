"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { getProductById } from "@/data/products";
import { useThemeStore } from "@/app/theme/store";
import { useTranslation } from "react-i18next";

export const dynamic = "force-dynamic";

const ProductDetail = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = Number(params.id);
  const product = getProductById(productId);

  if (!product) {
    return (
      <ClientLayout showHeader={false} showFooter={false}>
        <main className="product-detail-page">
          <div className="product-not-found">
            <h1>{t("productNotFound")}</h1>
            <button onClick={() => router.push("/category")}>
              {t("backToCategory")}
            </button>
          </div>
        </main>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout showHeader={false} showFooter={false}>
      <main className="product-detail-page">
        {/* Theme changer */}
        <button
          className="theme-changer-btn"
          onClick={toggleTheme}
          aria-label="Theme changer"
        >
          {theme === "light" ? <LuSunMedium /> : <LuMoon />}
        </button>

        {/* Back button */}
        <button
          className="back-btn"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <MdKeyboardArrowLeft size={24} />
          {t("backButton")}
        </button>

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <span className="breadcrumb-main">{t("breadcrumbMain")}</span> /{" "}
          <span className="breadcrumb-category">
            {t(product.category.toLowerCase())}
          </span>{" "}
          /{" "}
          <span className="breadcrumb-current">
            {t(product.name.toLowerCase().replace(/\s+/g, ""))}
          </span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="product-main-img"
              />
            </div>
            <div className="image-thumbnails">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className={`thumbnail${
                    selectedImage === idx ? " active" : ""
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">
              {t(product.name.toLowerCase().replace(/\s+/g, ""))}
            </h1>
            <div className="product-price">
              ${product.price.toLocaleString()}
            </div>

            <div className="product-description">
              <h3>{t("description")}</h3>
              <p>{t(product.description.toLowerCase().replace(/\s+/g, ""))}</p>
            </div>

            <div className="product-specs">
              <h3>{t("specifications")}</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">{t("dimensions")}</span>
                  <span className="spec-value">{product.specs.dimensions}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("materials")}</span>
                  <span className="spec-value">{product.specs.material}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("careInstructions")}</span>
                  <span className="spec-value">{product.specs.care}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("assembly")}</span>
                  <span className="spec-value">{product.specs.assembly}</span>
                </div>
              </div>
            </div>

            <div className="ordering-info">
              <h3>{t("orderingInfo")}</h3>
              <p className="ordering-text">
                {t("orderingText", {
                  productName: t(
                    product.name.toLowerCase().replace(/\s+/g, "")
                  ),
                })}
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-label">{t("phone")}</span>
                  <span className="contact-value">
                    {product.contactInfo?.phone || "(555) 123-4567"}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">{t("email")}</span>
                  <span className="contact-value">
                    {product.contactInfo?.email || "sales@cozyhome.com"}
                  </span>
                </div>
              </div>
            </div>

            <button className="contact-shop-btn">
              {t("contactShopAssistant")}
            </button>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
};

export default ProductDetail;
