"use client";

import ClientLayout from "@/components/layout/ClientLayout";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useCategoryStore } from "./store";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { CiGrid41 } from "react-icons/ci";
import { BsList } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import {
  useGetProducts,
  useGetProductsByCategorySlug,
  useGetProductsByCategoryIds,
} from "@/hooks/getProducts";
import { useGetCategories } from "@/hooks/getCategories";
import { useSearchParams, useRouter } from "next/navigation";
import { formatPriceNumber, getImageUrl } from "@/utils/formatPrice";
import { SkeletonGrid } from "@/components/ui/SkeletonLoader";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import SafeImage from "@/components/ui/SafeImage";

export const dynamic = "force-dynamic";

import Link from "next/link";

const PRODUCTS_PER_PAGE_GRID = 18;

const sortOptions = [
  { value: "asc", label: "priceLowToHigh" },
  { value: "desc", label: "priceHighToLow" },
];

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

const CategoryButton = React.memo(
  ({
    cat,
    isSelected,
    onClick,
    onRemove,
  }: {
    cat: string;
    isSelected: boolean;
    onClick: () => void;
    onRemove: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`category-btn${isSelected ? " category-btn-active" : ""}`}
    >
      {cat}
      {isSelected && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="category-btn-remove"
        >
          ×
        </span>
      )}
    </button>
  )
);
CategoryButton.displayName = "CategoryButton";

type ProductForCard = {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  price: number;
  material?: string;
  img?: { url?: string };
};

const ProductCard = React.memo(
  ({
    product,
    layout,
  }: {
    product: ProductForCard;
    layout: "grid" | "list";
  }) => {
    const router = useRouter();

    if (layout === "grid") {
      return (
        <Link
          href={`/product/${product.documentId}`}
          className="collection-card"
          prefetch={true}
          onMouseEnter={() => {
            router.prefetch(`/product/${product.documentId}`);
          }}
        >
          <div className="card-image">
            <SafeImage
              src={getImageUrl(product.img?.url)}
              alt={product.title}
              width={300}
              height={200}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="card-content">
            <h3>{product.title}</h3>
            <p className="product-price">{formatPriceNumber(product.price)}</p>
          </div>
        </Link>
      );
    }

    // List layout - use unified product card style
    return (
      <Link
        href={`/product/${product.documentId}`}
        className="product-card list"
        prefetch={true}
        onMouseEnter={() => {
          router.prefetch(`/product/${product.documentId}`);
        }}
      >
        <div className="card-image">
          <SafeImage
            src={getImageUrl(product.img?.url)}
            alt={product.title}
            width={300}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="card-content">
          <div className="card-title">{product.title}</div>
          <div className="card-description">{product.description}</div>
          <div className="card-price">{formatPriceNumber(product.price)}</div>
        </div>
      </Link>
    );
  }
);
ProductCard.displayName = "ProductCard";

const Category = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories = useCategoryStore((s) => s.selectedCategories);
  const setSelectedCategories = useCategoryStore(
    (s) => s.setSelectedCategories
  );
  const layout = useCategoryStore((s) => s.layout);
  const setLayout = useCategoryStore((s) => s.setLayout);
  const currentPage = useCategoryStore((s) => s.currentPage);
  const setCurrentPage = useCategoryStore((s) => s.setCurrentPage);
  const setSelectedCategory = useCategoryStore((s) => s.setSelectedCategory);
  const [priceRange] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const categorySlug = searchParams.get("category");

  const { data: categoriesData, loading: categoriesLoading } =
    useGetCategories();
  const { data: productsByCategoryData, loading: categoryProductsLoading } =
    useGetProductsByCategorySlug(categorySlug || "");
  const { data: allProductsData, loading: allProductsLoading } =
    useGetProducts();

  const categories = useMemo(
    () => categoriesData?.data || [],
    [categoriesData?.data]
  );

  const selectedCategoryIds = useMemo(() => {
    return selectedCategories
      .map((catName) => {
        const category = categories.find((c) => c.name === catName);
        return category?.id;
      })
      .filter((id) => id !== undefined) as number[];
  }, [selectedCategories, categories]);

  const {
    data: productsByMultipleCategoriesData,
    loading: multipleCategoriesLoading,
  } = useGetProductsByCategoryIds(selectedCategoryIds);
  const productsByCategory = useMemo(
    () => productsByCategoryData?.data || [],
    [productsByCategoryData?.data]
  );
  const allProducts = useMemo(
    () => allProductsData?.data || [],
    [allProductsData?.data]
  );

  useEffect(() => {
    if (categorySlug) {
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.name);
        setSelectedCategories([category.name]);
      }
    } else {
      setSelectedCategory("");
      setSelectedCategories([]);
    }
  }, [categorySlug, categories, setSelectedCategory, setSelectedCategories]);

  useEffect(() => {
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sortDropdownOpen]);

  useEffect(() => {
    useCategoryStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (categorySlug) {
      router.prefetch(`/category?category=${categorySlug}`);
    }
  }, [categorySlug, router]);

  const products = useMemo(() => {
    // Agar hech qanday category tanlanmagan bo'lsa, barcha productlarni qaytar
    if (selectedCategories.length === 0) {
      return allProducts;
    }

    // Agar bir nechta category tanlangan bo'lsa, multiple categories API dan olish
    if (selectedCategories.length > 1) {
      const multipleCategoriesProducts =
        productsByMultipleCategoriesData?.data || [];
      return multipleCategoriesProducts;
    }

    // Agar faqat bitta category tanlangan bo'lsa
    if (selectedCategories.length === 1) {
      // Avval categorySlug orqali kelgan productlarni tekshir
      if (categorySlug && productsByCategory.length > 0) {
        return productsByCategory;
      }

      // Agar categorySlug orqali productlar topilmasa, selectedCategoryIds orqali olish
      // Lekin faqat bitta category bo'lgani uchun, uni to'g'ridan-to'g'ri ishlatamiz
      if (selectedCategoryIds.length === 1) {
        const singleCategoryProducts =
          productsByMultipleCategoriesData?.data || [];
        return singleCategoryProducts;
      }

      // Agar hech qanday usul bilan productlar topilmasa, barcha productlarni qaytar
      return allProducts;
    }

    return allProducts;
  }, [
    categorySlug,
    productsByCategory,
    selectedCategories,
    selectedCategoryIds,
    productsByMultipleCategoriesData,
    allProducts,
  ]);

  const categoryOptions = useMemo(
    () => categories.map((cat) => cat.name),
    [categories]
  );

  const { totalPages, paginatedProducts } = useMemo(() => {
    const filtered = products.filter((product: ProductForCard) => {
      const min = priceRange.min ? parseInt(priceRange.min) : 0;
      const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
      const priceMatch = product.price >= min && product.price <= max;
      return priceMatch;
    });

    const sorted = [...filtered].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    );

    const total = Math.ceil(sorted.length / PRODUCTS_PER_PAGE_GRID);
    const paginated = sorted.slice(
      (currentPage - 1) * PRODUCTS_PER_PAGE_GRID,
      currentPage * PRODUCTS_PER_PAGE_GRID
    );

    return {
      totalPages: total,
      paginatedProducts: paginated,
    };
  }, [products, priceRange, sortOrder, currentPage]);

  const handleCategoryClick = useCallback(
    (cat: string) => {
      if (cat === t("allCategories")) {
        setSelectedCategories([]);
        setSelectedCategory("");
        router.push("/category");
      } else if (selectedCategories.includes(cat)) {
        const newCategories = selectedCategories.filter((c) => c !== cat);
        setSelectedCategories(newCategories);

        if (newCategories.length === 0) {
          setSelectedCategory("");
          router.push("/category");
        } else {
          setSelectedCategory(newCategories.join(", "));
        }
      } else {
        const newCategories = [
          ...selectedCategories.filter((c) => c !== t("allCategories")),
          cat,
        ];
        setSelectedCategories(newCategories);

        if (newCategories.length === 1) {
          setSelectedCategory(cat);
          const categoryObj = categories.find((c) => c.name === cat);
          if (categoryObj) {
            router.push(`/category?category=${categoryObj.slug}`);
          }
        } else {
          setSelectedCategory(newCategories.join(", "));
        }
      }
      setCurrentPage(1);
    },
    [
      selectedCategories,
      categories,
      setSelectedCategory,
      setSelectedCategories,
      setCurrentPage,
      router,
      t,
    ]
  );

  const handleRemoveCategory = useCallback(
    (cat: string) => {
      const newCategories = selectedCategories.filter((c) => c !== cat);
      setSelectedCategories(newCategories);

      if (newCategories.length === 0) {
        setSelectedCategory("");
        router.push("/category");
      } else {
        if (newCategories.length === 1) {
          setSelectedCategory(newCategories[0]);
          const categoryObj = categories.find(
            (c) => c.name === newCategories[0]
          );
          if (categoryObj) {
            router.push(`/category?category=${categoryObj.slug}`);
          }
        } else {
          setSelectedCategory(newCategories.join(", "));
        }
      }

      setCurrentPage(1);
    },
    [
      selectedCategories,
      categories,
      setSelectedCategory,
      setSelectedCategories,
      setCurrentPage,
      router,
    ]
  );

  if (!categoriesLoading && !categories.length && categoriesData === null) {
    return (
      <ClientLayout showHeader={true} showFooter={true}>
        <main className="category-page">
          <ErrorState
            title={t("noCategories")}
            description={t("noCategoriesDescription")}
            onRetry={() => window.location.reload()}
            iconType="error"
          />
        </main>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout showHeader={true} showFooter={true}>
      <main className="category-page">
        <nav className="breadcrumb">
          <Link href="/" className="breadcrumb-main">
            {t("breadcrumbMain")}
          </Link>{" "}
          /{" "}
          <span className="breadcrumb-current">
            {selectedCategories.length > 0
              ? selectedCategories.length === 1
                ? t(selectedCategories[0])
                : `${selectedCategories.length} ${t("categories")}`
              : t("breadcrumbCategory")}
          </span>
        </nav>
        <h1 className="category-title">
          {selectedCategories.length > 0
            ? selectedCategories.length === 1
              ? `${t(selectedCategories[0])} ${t("breadcrumbMain")}`
              : `${selectedCategories.length} ${t("categories")} ${t(
                  "breadcrumbMain"
                )}`
            : `${t("breadcrumbCategory")} ${t("breadcrumbMain")}`}
        </h1>
        <div className="category-filter-panel">
          <div className="category-filter-btns">
            <button
              onClick={() => handleCategoryClick(t("allCategories"))}
              className={`category-btn category-btn-all${
                selectedCategories.length === 0 ? " category-btn-active" : ""
              }`}
            >
              {t("allCategories")}
            </button>
            {categoryOptions.map((cat) => (
              <CategoryButton
                key={cat}
                cat={cat}
                isSelected={selectedCategories.includes(cat)}
                onClick={() => handleCategoryClick(cat)}
                onRemove={() => handleRemoveCategory(cat)}
              />
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
          className={layout === "grid" ? "collections-grid" : "products-list"}
        >
          {categoriesLoading ? (
            <SkeletonGrid
              count={layout === "grid" ? 12 : 6}
              type={layout === "grid" ? "collection" : "product"}
              layout={layout}
            />
          ) : allProductsLoading && selectedCategories.length === 0 ? (
            <SkeletonGrid
              count={layout === "grid" ? 12 : 6}
              type={layout === "grid" ? "collection" : "product"}
              layout={layout}
            />
          ) : categoryProductsLoading && categorySlug ? (
            <SkeletonGrid
              count={layout === "grid" ? 12 : 6}
              type={layout === "grid" ? "collection" : "product"}
              layout={layout}
            />
          ) : multipleCategoriesLoading && selectedCategories.length > 1 ? (
            <SkeletonGrid
              count={layout === "grid" ? 12 : 6}
              type={layout === "grid" ? "collection" : "product"}
              layout={layout}
            />
          ) : paginatedProducts.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
              <EmptyState
                title={t("noProducts")}
                description={t("noProductsDescription")}
                iconType="products"
              />
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout={layout} />
            ))
          )}
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
