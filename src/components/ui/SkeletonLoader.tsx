"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const SkeletonElement: React.FC<SkeletonProps> = ({ className = "", style = {} }) => (
  <div
    className={`skeleton-element ${className}`}
    style={style}
  />
);

export const ProductCardSkeleton: React.FC<{ layout?: "grid" | "list" }> = ({ layout = "grid" }) => (
  <div className={`product-card-skeleton ${layout}`}>
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <SkeletonElement className="skeleton-title" />
      {layout === "list" && (
        <SkeletonElement className="skeleton-description" />
      )}
      <SkeletonElement className="skeleton-price" />
    </div>
  </div>
);

export const CollectionCardSkeleton: React.FC = () => (
  <div className="collection-card-skeleton">
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <SkeletonElement className="skeleton-title" />
      <SkeletonElement className="skeleton-price" />
    </div>
  </div>
);

export const CategoryCardSkeleton: React.FC = () => (
  <div className="category-card-skeleton">
    <div className="skeleton-image" />
    <SkeletonElement className="skeleton-title" />
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <div className="product-detail-skeleton">
    <div className="skeleton-actions">
      <SkeletonElement className="skeleton-back-btn" />
      <div className="skeleton-right-actions">
        <SkeletonElement className="skeleton-btn" />
        <SkeletonElement className="skeleton-btn" />
      </div>
    </div>
    
    <SkeletonElement className="skeleton-breadcrumb" />
    
    <div className="skeleton-product-content">
      <div className="skeleton-images">
        <div className="skeleton-main-image" />
        <div className="skeleton-thumbnails">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonElement key={i} className="skeleton-thumbnail" />
          ))}
        </div>
      </div>
      
      <div className="skeleton-info">
        <SkeletonElement className="skeleton-product-title" />
        <SkeletonElement className="skeleton-product-price" />
        <SkeletonElement className="skeleton-description" />
        <SkeletonElement className="skeleton-specs" />
        <SkeletonElement className="skeleton-contact-btn" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{
  count: number;
  type: "product" | "collection" | "category";
  layout?: "grid" | "list";
}> = ({ count, type, layout = "grid" }) => (
  <div className={`skeleton-grid ${layout}`}>
    {Array.from({ length: count }).map((_, index) => {
      switch (type) {
        case "product":
          return <ProductCardSkeleton key={index} layout={layout} />;
        case "collection":
          return <CollectionCardSkeleton key={index} />;
        case "category":
          return <CategoryCardSkeleton key={index} />;
        default:
          return <ProductCardSkeleton key={index} layout={layout} />;
      }
    })}
  </div>
);

export default SkeletonElement;
