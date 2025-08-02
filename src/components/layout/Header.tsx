"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuSunMedium, LuMoon } from "react-icons/lu";
import { useCategoryStore } from "@/app/category/store";
import type { CategoryState } from "@/app/category/store";
import { useThemeStore } from "@/app/theme/store";
import { useRouter, usePathname } from "next/navigation";
import { products, type Product } from "@/data/products";
import { useTranslation } from "react-i18next";
import LanguageChanger from "../ui/LanguageChanger";

const categories = [
  { name: "sofas" },
  { name: "coffeeTables" },
  { name: "endTables" },
  { name: "tvStands" },
  { name: "armchairs" },
];

const Header = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
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

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchResultClick = (productId: number) => {
    setSearchQuery("");
    setShowSearchResults(false);
    router.push(`/product/${productId}`);
  };

  const handleSearchInputFocus = () => {
    if (searchQuery.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchInputBlur = () => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showSearchResults && target && !target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSearchResults]);

  return (
    <header className="header">
      <Link href="/" className="logo">
        <img src="/icons/logo.png" alt="logo" />
        <h5>{t("logo")}</h5>
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
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="search-result-image"
                    />
                    <div className="search-result-content">
                      <div className="search-result-name">
                        {t(product.name.toLowerCase().replace(/\s+/g, ""))}
                      </div>
                      <div className="search-result-category">
                        {t(product.category)}
                      </div>
                      <div className="search-result-price">
                        ${product.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ul className="menu-list">
            {categories.map((cat) => (
              <li key={cat.name}>
                <button
                  className={
                    selectedCategory === cat.name ? "active-category" : ""
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "inherit",
                    font: "inherit",
                  }}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    router.push("/category");
                  }}
                >
                  {t(cat.name)}
                </button>
              </li>
            ))}
          </ul>
        )}
        <ul className="btn-group">
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
    </header>
  );
};
export default Header;
