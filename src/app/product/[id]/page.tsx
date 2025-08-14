"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import React, { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { useThemeStore } from "@/app/theme/store";
import { useTranslation } from "react-i18next";
import LanguageChanger from "@/components/ui/LanguageChanger";
import { useGetProduct } from "@/hooks/getProducts";
import { formatPriceNumber, getImageUrl } from "@/utils/formatPrice";

export const dynamic = "force-dynamic";

const ProductDetail = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const documentId = params.id as string;
  const { data: productData, loading, error } = useGetProduct(documentId);
  const product = productData?.data;

  // Memoize expensive translation operations
  const productNameKey = useMemo(() => product?.title, [product?.title]);

  const productDescriptionKey = useMemo(
    () => product?.description,
    [product?.description]
  );

  const handleContactClick = useCallback(() => {
    setShowContactInfo(!showContactInfo);
  }, [showContactInfo]);

  // Loading state
  if (loading) {
    return (
      <ClientLayout showHeader={false} showFooter={false}>
        <main className="product-detail-page">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Loading...</h2>
          </div>
        </main>
      </ClientLayout>
    );
  }

  // Error state
  if (error || !product) {
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

  // Get product images from API or use default
  const productImages = product?.img
    ? [
        getImageUrl(product.img.url),
        product.img.formats?.large?.url
          ? getImageUrl(product.img.formats.large.url)
          : getImageUrl(product.img.url),
        product.img.formats?.medium?.url
          ? getImageUrl(product.img.formats.medium.url)
          : getImageUrl(product.img.url),
        product.img.formats?.small?.url
          ? getImageUrl(product.img.formats.small.url)
          : getImageUrl(product.img.url),
      ]
    : [
        "/img/cardimg.png",
        "/img/cardimg.png",
        "/img/cardimg.png",
        "/img/cardimg.png",
      ];

  return (
    <ClientLayout showHeader={false} showFooter={false}>
      <main className="product-detail-page">
        <div className="actions">
          {/* Back button */}
          <button
            className="back-btn"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <MdKeyboardArrowLeft size={24} />
            {t("backButton")}
          </button>
          <div
            className="left_actions"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <button
              className="primary-btn"
              onClick={toggleTheme}
              aria-label="Theme changer"
            >
              {theme === "light" ? <LuSunMedium /> : <LuMoon />}
            </button>
            <LanguageChanger />
          </div>
        </div>

        <nav className="breadcrumb">
          <span className="breadcrumb-main">{t("breadcrumbMain")}</span> /{" "}
          <span className="breadcrumb-category">{product.material}</span> /{" "}
          <span className="breadcrumb-current">
            {productNameKey || product.title}
          </span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={productImages[selectedImage]}
                alt={product.title}
                className="product-main-img"
              />
            </div>
            <div className="image-thumbnails">
              {productImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
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
            <h1 className="product-title">{productNameKey || product.title}</h1>
            <div className="product-price">
              {formatPriceNumber(product.price)}
            </div>

            <div className="product-description">
              <h3>{t("description")}</h3>
              <p>{productDescriptionKey || product.description}</p>
            </div>

            <div className="product-specs">
              <h3>{t("specifications")}</h3>
              <div className="specs-grid">
                {product.SizesOfProduct && (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">{t("height")}</span>
                      <span className="spec-value">
                        {product.SizesOfProduct.height} cm
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">{t("width")}</span>
                      <span className="spec-value">
                        {product.SizesOfProduct.width} cm
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">{t("depth")}</span>
                      <span className="spec-value">
                        {product.SizesOfProduct.depth} cm
                      </span>
                    </div>
                  </>
                )}
                <div className="spec-item">
                  <span className="spec-label">{t("materials")}</span>
                  <span className="spec-value">{product.material}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("quantity")}</span>
                  <span className="spec-value">{product.quantity}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("delivery")}</span>
                  <span className="spec-value">
                    {product.delivery ? t("available") : t("notAvailable")}
                  </span>
                </div>
              </div>
            </div>

            <div className="ordering-info">
              <h3>{t("orderingInfo")}</h3>
              <p className="ordering-text">
                {t("orderingText", {
                  productName: productNameKey || product.title,
                })}
              </p>

              <button
                className={`contact-shop-btn ${
                  showContactInfo ? "active" : ""
                }`}
                onClick={handleContactClick}
              >
                {showContactInfo
                  ? t("hideContactInfo")
                  : t("contactShopAssistant")}
              </button>

              {showContactInfo && (
                <div className="contact-details contact-animation">
                  <div className="contact-item">
                    <span className="contact-label">{t("phone")}</span>
                    <span className="contact-value">+998 95 083 21 27</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">{t("email")}</span>
                    <span className="contact-value">
                      dilmurodvccfx@gmail.com
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
};

export default ProductDetail;
