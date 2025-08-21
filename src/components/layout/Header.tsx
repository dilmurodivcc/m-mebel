"use client";

import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { useCategoryStore } from "@/app/category/store";
import type { CategoryState } from "@/app/category/store";
import { useThemeStore } from "@/app/theme/store";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageChanger from "../ui/LanguageChanger";
import { useGetCategories } from "@/hooks/getCategories";
import { useGetProducts } from "@/hooks/getProducts";
import { useGetSiteInfo } from "@/hooks/getGlobals";
import { formatPriceNumber, getImageUrl } from "@/utils/formatPrice";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdClose, MdCategory, MdHome } from "react-icons/md";

const Header = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  type SearchProduct = {
    id: number;
    documentId?: string;
    title?: string;
    material?: string;
    price?: number;
    img?: { url?: string };
  };
  const maxCategoryLength = 4;
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const selectedCategory = useCategoryStore(
    (state: CategoryState) => state.selectedCategory
  );
  const setSelectedCategory = useCategoryStore(
    (state: CategoryState) => state.setSelectedCategory
  );
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: categoriesData, loading: categoriesLoading } =
    useGetCategories();
  const { data: productsData } = useGetProducts();
  const { siteName, favicon, loading: siteInfoLoading } = useGetSiteInfo();

  const categories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData]
  );
  const products = useMemo(() => productsData?.data || [], [productsData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        isMenuOpen &&
        target &&
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-overlay")
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isMenuOpen]);
  const filteredSearchResults = useMemo(() => {
    if (
      !searchQuery.trim() ||
      !products ||
      !Array.isArray(products) ||
      !products.length
    ) {
      return [];
    }

    return products
      .filter(
        (product) =>
          product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.material?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSearchResults(filteredSearchResults);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [filteredSearchResults, searchQuery]);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleSearchResultClick = useCallback(
    (documentId: string) => {
      if (!documentId) {
        return;
      }
      setSearchQuery("");
      setShowSearchResults(false);
      router.push(`/product/${documentId}`);
    },
    [router]
  );

  const handleSearchInputFocus = useCallback(() => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true);
    }
  }, [searchQuery]);

  const handleSearchInputBlur = useCallback(() => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSearchResults && target && !target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showSearchResults]);

  const handleCategoryHover = useCallback(
    (cat: { name?: string; slug?: string }) => {
      if (!cat?.slug) return;

      router.prefetch(`/category?category=${cat.slug}`);
    },
    [router]
  );

  const handleCategoryClick = useCallback(
    (cat: { name?: string; slug?: string }) => {
      if (!cat?.name || !cat?.slug) {
        return;
      }

      setSelectedCategory(cat.name);

      router.push(`/category?category=${cat.slug}`);
    },
    [setSelectedCategory, router]
  );

  return (
    <header className="header">
      <Link href="/" className="logo">
        <img
          src={favicon?.url ? getImageUrl(favicon.url) : "/icons/logo.png"}
          alt={isClient ? siteName || "logo" : "logo"}
          width={120}
          style={{
            opacity: siteInfoLoading ? 0.7 : 1,
            transition: "opacity 0.3s ease",
          }}
          suppressHydrationWarning
        />
        <h5
          style={{
            opacity: siteInfoLoading ? 0.7 : 1,
            transition: "opacity 0.3s ease",
          }}
          suppressHydrationWarning
        >
          {isClient ? siteName || t("logo") : t("logo")}
        </h5>
      </Link>
      <nav className="navbar">
        {!isHomePage ? (
          <div className="search-container">
            <div className="search-bar">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
                className="search-input"
              />
            </div>
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((product) => (
                  <div
                    key={product?.id || Math.random()}
                    className="search-result-item"
                    onClick={() =>
                      product?.documentId &&
                      handleSearchResultClick(product.documentId)
                    }
                  >
                    <img
                      src={
                        product?.img?.url
                          ? getImageUrl(product.img.url)
                          : "/img/cardimg.png"
                      }
                      alt={product?.title || "Product"}
                      className="search-result-image"
                    />
                    <div className="search-result-content">
                      <div className="search-result-name">
                        {product?.title || "Unknown Product"}
                      </div>
                      <div className="search-result-category">
                        {product?.material || "No material"}
                      </div>
                      <div className="search-result-price">
                        {product?.price
                          ? formatPriceNumber(product.price)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ul className="menu-list">
            {categoriesLoading
              ? Array.from({ length: maxCategoryLength }).map((_, index) => (
                  <li key={`loading-category-${index}`}>
                    <div className="header-category-skeleton"></div>
                  </li>
                ))
              : categories.slice(0, maxCategoryLength).map((cat) => (
                  <li key={cat?.id || Math.random()}>
                    <button
                      className={
                        selectedCategory === cat?.name ? "active-category" : ""
                      }
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "inherit",
                        font: "inherit",
                      }}
                      onClick={() => cat && handleCategoryClick(cat)}
                      onMouseEnter={() => cat && handleCategoryHover(cat)}
                    >
                      {cat?.name || "Unknown Category"}
                    </button>
                  </li>
                ))}
          </ul>
        )}
        <ul className="btn-group">
          <li className="mobile-menu">
            <button
              className="primary-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <HiMenuAlt3 />
            </button>
          </li>
          <li>
            <button className="primary-btn" onClick={toggleTheme}>
              {theme === "light" ? <LuSunMedium /> : <LuMoon />}
            </button>
          </li>
          <li>
            <LanguageChanger />
          </li>
        </ul>
      </nav>
      {isMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">


            <ul className="mobile-menu-list">
              {/* Home Link */}
              <li className="mobile-menu-item">
                <Link
                  href="/"
                  className={`mobile-menu-link ${
                    pathname === "/" ? "active" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MdHome className="mobile-menu-icon" />
                  {t("breadcrumbMain")}
                </Link>
              </li>

              {/* All Categories Link */}
              <li className="mobile-menu-item">
                <Link
                  href="/category"
                  className={`mobile-menu-link ${
                    pathname === "/category" && !selectedCategory
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory("");
                    setIsMenuOpen(false);
                  }}
                >
                  <MdCategory className="mobile-menu-icon" />
                  {t("allCategories")}
                </Link>
              </li>

              {/* Category Links */}
              {categories.map((cat) => (
                <li key={cat?.id || Math.random()} className="mobile-menu-item">
                  <button
                    className={`mobile-menu-link ${
                      selectedCategory === cat?.name ? "active" : ""
                    }`}
                    onClick={() => {
                      if (cat) {
                        handleCategoryClick(cat);
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    <MdCategory className="mobile-menu-icon" />
                    {cat?.name || "Unknown Category"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
