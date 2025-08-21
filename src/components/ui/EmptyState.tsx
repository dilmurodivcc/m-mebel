import React from "react";
import { useTranslation } from "react-i18next";
import {
  MdSearchOff,
  MdInbox,
  MdCategory,
  MdShoppingCart,
} from "react-icons/md";

interface EmptyStateProps {
  title?: string;
  description?: string;
  iconType?: "search" | "products" | "categories" | "cart";
  showIcon?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconType = "products",
  showIcon = true,
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    const iconSize = 64;
    const iconColor = "var(--text-tertiary)";

    switch (iconType) {
      case "search":
        return <MdSearchOff size={iconSize} color={iconColor} />;
      case "categories":
        return <MdCategory size={iconSize} color={iconColor} />;
      case "cart":
        return <MdShoppingCart size={iconSize} color={iconColor} />;
      default:
        return <MdInbox size={iconSize} color={iconColor} />;
    }
  };

  const getDefaultTitle = () => {
    switch (iconType) {
      case "search":
        return t("noSearchResults") || "No search results found";
      case "categories":
        return t("noCategories") || "No categories available";
      case "cart":
        return t("cartEmpty") || "Your cart is empty";
      default:
        return t("noProducts") || "No products found";
    }
  };

  const getDefaultDescription = () => {
    switch (iconType) {
      case "search":
        return (
          t("noSearchResultsDescription") ||
          "Try adjusting your search terms or browse our categories."
        );
      case "categories":
        return (
          t("noCategoriesDescription") ||
          "We're working on adding more categories. Please check back later."
        );
      case "cart":
        return (
          t("cartEmptyDescription") ||
          "Add some products to your cart to get started."
        );
      default:
        return (
          t("noProductsDescription") ||
          "No products match your current filters. Try adjusting your search criteria."
        );
    }
  };

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        {showIcon && <div className="empty-icon">{getIcon()}</div>}

        <h3 className="empty-title">{title || getDefaultTitle()}</h3>

        <p className="empty-description">
          {description || getDefaultDescription()}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
