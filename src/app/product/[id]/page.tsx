"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { useThemeStore } from "@/app/theme/store";
import { useTranslation } from "react-i18next";
import LanguageChanger from "@/components/ui/LanguageChanger";
import { useGetProduct } from "@/hooks/getProducts";
import { formatPriceNumber, getImageUrl } from "@/utils/formatPrice";
import { ProductDetailSkeleton } from "@/components/ui/SkeletonLoader";
import ErrorState from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

const ProductDetail = () => {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const documentId = params.id as string;
  const { data: productData, loading, error } = useGetProduct(documentId);
  const product = productData?.data;

  const getProductImages = () => {
    if (!product) {
      return [
        "/img/cardimg.png",
        "/img/cardimg.png",
        "/img/cardimg.png",
        "/img/cardimg.png",
      ];
    }

    const images = [];

    if (product.img && product.img.url) {
      try {
        images.push(getImageUrl(product.img.url));
      } catch (error) {
        console.warn("Error processing main image:", error);
      }
    }

    if (
      product.detail_img &&
      Array.isArray(product.detail_img) &&
      product.detail_img.length > 0
    ) {
      product.detail_img.forEach((detailImg) => {
        if (detailImg && detailImg.url) {
          try {
            images.push(getImageUrl(detailImg.url));
          } catch (error) {
            console.warn("Error processing detail image:", error);
          }
        }
      });
    }

    if (images.length === 0) {
      return [
        "/img/cardimg.png",
        "/img/cardimg.png",
        "/img/cardimg.png",
        "/img/cardimg.png",
      ];
    }

    return images;
  };

  const productImages = getProductImages();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setSelectedImage(0);
  }, [product?.id]);

  useEffect(() => {
    if (productImages.length > 0 && selectedImage >= productImages.length) {
      setSelectedImage(0);
    }
  }, [productImages.length, selectedImage]);

  const productNameKey = product?.title;
  const productDescriptionKey = product?.description;

  const handleContactClick = useCallback(() => {
    setShowContactInfo(!showContactInfo);
  }, [showContactInfo]);

  if (loading) {
    return (
      <ClientLayout showHeader={false} showFooter={false}>
        <main className="product-detail-page">
          <ProductDetailSkeleton />
        </main>
      </ClientLayout>
    );
  }

  if (error || !product) {
    return (
      <ClientLayout showHeader={false} showFooter={false}>
        <main className="product-detail-page">
          <ErrorState
            title={!product ? t("productNotFound") : undefined}
            description={
              !product
                ? t("productNotFoundDescription") ||
                  "The product you're looking for doesn't exist or has been removed."
                : undefined
            }
            error={error || undefined}
            onRetry={() => router.push("/category")}
            iconType={
              error?.includes("timeout")
                ? "timeout"
                : error?.includes("network")
                ? "network"
                : "error"
            }
          />
        </main>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout showHeader={false} showFooter={false}>
      <main className="product-detail-page">
        <div className="actions">
          <button
            className="back-btn"
            onClick={() => router.back()}
            aria-label={t("goBack")}
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
              aria-label={t("themeChanger")}
            >
              {theme === "light" ? <LuSunMedium /> : <LuMoon />}
            </button>
            <LanguageChanger />
          </div>
        </div>

        <nav className="breadcrumb">
          <Link href="/" className="breadcrumb-main">
            {t("breadcrumbMain")}
          </Link>{" "}
          /{" "}
          <Link
            href={`/category?category=${
              product?.material?.toLowerCase() || ""
            }`}
            className="breadcrumb-category"
          >
            {product?.material || ""}
          </Link>{" "}
          /{" "}
          <span className="breadcrumb-current" suppressHydrationWarning>
            {isClient
              ? productNameKey || product?.title || t("loading")
              : t("loading")}
          </span>
        </nav>

        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img
                src={
                  (productImages.length > 0 && productImages[selectedImage]) ||
                  (productImages.length > 0 && productImages[0]) ||
                  "/img/cardimg.png"
                }
                alt={product?.title || t("product")}
                className="product-main-img"
                onError={(e) => {
                  e.currentTarget.src = "/img/cardimg.png";
                }}
                loading="eager"
              />
            </div>
            <div className="image-thumbnails">
              {productImages.length > 0 &&
                productImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product?.title || t("product")} ${idx + 1}`}
                    className={`thumbnail${
                      selectedImage === idx ? " active" : ""
                    }`}
                    onClick={() => setSelectedImage(idx)}
                    onError={(e) => {
                      e.currentTarget.src = "/img/cardimg.png";
                    }}
                    loading="lazy"
                  />
                ))}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title" suppressHydrationWarning>
              {isClient
                ? productNameKey || product?.title || t("loading")
                : t("loading")}
            </h1>
            <div className="product-price">
              {product?.price ? formatPriceNumber(product.price) : t("loading")}
            </div>

            <div className="product-description">
              <h3>{t("description")}</h3>
              <p suppressHydrationWarning>
                {isClient
                  ? productDescriptionKey ||
                    product?.description ||
                    t("loading")
                  : t("loading")}
              </p>
            </div>

            <div className="product-specs">
              <h3>{t("specifications")}</h3>
              <div className="specs-grid">
                {product?.SizesOfProduct && (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">{t("height")}</span>
                      <span className="spec-value">
                        {product.SizesOfProduct.height}
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">{t("width")}</span>
                      <span className="spec-value">
                        {product.SizesOfProduct.width}
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">{t("depth")}</span>
                      <span className="spec-value">
                        {product.SizesOfProduct.depth}
                      </span>
                    </div>
                  </>
                )}
                <div className="spec-item">
                  <span className="spec-label">{t("materials")}</span>
                  <span className="spec-value">
                    {product?.material || "N/A"}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("quantity")}</span>
                  <span className="spec-value">
                    {product?.quantity || "N/A"}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">{t("delivery")}</span>
                  <span className="spec-value">
                    {product?.delivery !== undefined
                      ? product.delivery
                        ? t("available")
                        : t("notAvailable")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="ordering-info">
              <h3>{t("orderingInfo")}</h3>
              <p className="ordering-text">
                {t("orderingText", {
                  productName: isClient
                    ? productNameKey || product?.title || t("loading")
                    : t("loading"),
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
