"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import React, { useState, useRef, useEffect } from "react";
import { useCategoryStore } from "./store";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { CiGrid41 } from "react-icons/ci";
import { BsList } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { useTranslation } from "react-i18next";
export const dynamic = "force-dynamic";

import Link from "next/link";

const mockProducts = products;

const PRODUCTS_PER_PAGE = 8;

const categoryOptions = [
  "sofas",
  "coffeeTables",
  "endTables",
  "tvStands",
  "armchairs",
];

const sortOptions = [
  { value: "asc", label: "priceLowToHigh" },
  { value: "desc", label: "priceHighToLow" },
];

// Pagination helpers
function getPagination(current: number, total: number) {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l: number | undefined = undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (let i = 0; i < range.length; i++) {
    if (l !== undefined) {
      if (range[i] - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (range[i] - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(range[i]);
    l = range[i];
  }
  return rangeWithDots;
}

const Category = () => {
  const { t } = useTranslation();
  const selectedCategory = useCategoryStore((s) => s.selectedCategory);
  const layout = useCategoryStore((s) => s.layout);
  const setLayout = useCategoryStore((s) => s.setLayout);
  const currentPage = useCategoryStore((s) => s.currentPage);
  const setCurrentPage = useCategoryStore((s) => s.setCurrentPage);
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-select category from header
  useEffect(() => {
    if (selectedCategory && selectedCategories.length === 0) {
      setSelectedCategories([selectedCategory]);
    }
  }, [selectedCategory, selectedCategories]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setSortDropdownOpen(false);
      }
    }
    if (sortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sortDropdownOpen]);

  const filteredProducts = mockProducts.filter((product) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(t("allCategories")) ||
      selectedCategories.some((cat) => product.category === cat);
    const min = priceRange.min ? parseInt(priceRange.min) : 0;
    const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
    const priceMatch = product.price >= min && product.price <= max;
    return categoryMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryClick = (cat: string) => {
    if (cat === t("allCategories")) {
      setSelectedCategories([]);
      useCategoryStore.getState().setSelectedCategory("");
    } else if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([
        ...selectedCategories.filter((c) => c !== t("allCategories")),
        cat,
      ]);
    }
    setCurrentPage(1);
  };
  const handleRemoveCategory = (cat: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    setCurrentPage(1);
  };

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="category-page">
        <nav className="breadcrumb">
          <span className="breadcrumb-main">{t("breadcrumbMain")}</span> /{" "}
          <span className="breadcrumb-current">
            {selectedCategory ? t(selectedCategory) : t("breadcrumbCategory")}
          </span>
        </nav>
        <h1 className="category-title">
          {selectedCategory ? t(selectedCategory) : t("breadcrumbCategory")}{" "}
          {t("breadcrumbMain")}
        </h1>
        <div className="category-filter-panel">
          <div className="category-filter-btns">
            <button
              onClick={() => handleCategoryClick(t("allCategories"))}
              className="category-btn category-btn-all"
            >
              {t("allCategories")}
            </button>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`category-btn${
                  selectedCategories.includes(cat) ? " category-btn-active" : ""
                }`}
              >
                {t(cat)}
                {selectedCategories.includes(cat) && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCategory(cat);
                    }}
                    className="category-btn-remove"
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="category-price-filter">
            <span className="category-price-label">{t("priceLabel")}</span>
            <div className="category-sort-dropdown" ref={sortDropdownRef}>
              <button
                type="button"
                className="category-sort-custom-btn"
                onClick={() => setSortDropdownOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortDropdownOpen}
              >
                {t(sortOptions.find((o) => o.value === sortOrder)?.label || "")}
                <span
                  className={`dropdown-arrow${sortDropdownOpen ? " open" : ""}`}
                >
                  <MdKeyboardArrowDown />
                </span>
              </button>
              {sortDropdownOpen && (
                <div className="category-sort-dropdown-list dropdown-anim">
                  {sortOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`category-sort-dropdown-item${
                        sortOrder === opt.value ? " selected" : ""
                      }`}
                      onClick={() => {
                        setSortOrder(opt.value as "asc" | "desc");
                        setSortDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={sortOrder === opt.value}
                    >
                      {t(opt.label)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="category-title-row">
          <div>
            <button
              onClick={() => setLayout("grid")}
              className={`category-layout-btn${
                layout === "grid" ? " active" : ""
              }`}
            >
              <CiGrid41 size={28} />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`category-layout-btn${
                layout === "list" ? " active" : ""
              }`}
            >
              <BsList size={29} />
            </button>
          </div>
        </div>
        <div
          className={
            layout === "grid"
              ? "products-grid category-products-grid"
              : "products-list category-products-list"
          }
        >
          {paginatedProducts.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className={`product-card category-product-card${
                layout === "grid" ? " grid" : " list"
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className={`category-product-img${
                  layout === "grid" ? " grid" : " list"
                }`}
              />
              <div className="category-product-content">
                <div className="category-product-name">
                  {t(product.name.toLowerCase().replace(/\s+/g, ""))}
                </div>
                {layout === "list" && (
                  <div className="category-product-description">
                    {t(product.description.toLowerCase().replace(/\s+/g, ""))}
                  </div>
                )}
                <div className="category-product-price">
                  ${product.price.toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="category-pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="category-pagination-btn nav"
            aria-label="Previous page"
          >
            <MdKeyboardArrowLeft size={28} />
          </button>
          {getPagination(currentPage, totalPages).map((item, index) =>
            item === "..." ? (
              <span key={index} className="category-pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(Number(item))}
                className={`category-pagination-btn${
                  currentPage === item ? " active" : ""
                }`}
                aria-current={currentPage === item ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="category-pagination-btn nav"
            aria-label="Next page"
          >
            <MdKeyboardArrowRight size={28} />
          </button>
        </div>
      </main>
    </ClientLayout>
  );
};

export default Category;
