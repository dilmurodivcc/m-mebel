import React from "react";
import { useTranslation } from "react-i18next";
import {
  MdErrorOutline,
  MdRefresh,
  MdWifiOff,
  MdCloudOff,
  MdAccessTime,
} from "react-icons/md";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: string | null;
  onRetry?: () => void;
  showIcon?: boolean;
  iconType?: "error" | "network" | "timeout" | "server";
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  error,
  onRetry,
  showIcon = true,
  iconType = "error",
}) => {
  const { t } = useTranslation();

  const getIcon = () => {
    const iconSize = 64;
    const iconColor = "var(--primary-color)";

    switch (iconType) {
      case "network":
        return <MdWifiOff size={iconSize} color={iconColor} />;
      case "timeout":
        return <MdAccessTime size={iconSize} color={iconColor} />;
      case "server":
        return <MdCloudOff size={iconSize} color={iconColor} />;
      default:
        return <MdErrorOutline size={iconSize} color={iconColor} />;
    }
  };

  const getDefaultTitle = () => {
    switch (iconType) {
      case "network":
        return t("networkErrorTitle") || "Network Connection Error";
      case "timeout":
        return t("timeoutErrorTitle") || "Request Timeout";
      case "server":
        return t("serverErrorTitle") || "Server Error";
      default:
        return t("generalErrorTitle") || "Something went wrong";
    }
  };

  const getDefaultDescription = () => {
    switch (iconType) {
      case "network":
        return (
          t("networkErrorDescription") ||
          "Please check your internet connection and try again."
        );
      case "timeout":
        return (
          t("timeoutErrorDescription") ||
          "The request took too long to complete. Please try again."
        );
      case "server":
        return (
          t("serverErrorDescription") ||
          "Our servers are experiencing issues. Please try again later."
        );
      default:
        return (
          t("generalErrorDescription") ||
          "We encountered an unexpected error. Please try again."
        );
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="error-state">
      <div className="error-state-content">
        {showIcon && <div className="error-icon">{getIcon()}</div>}

        <h2 className="error-title">{title || getDefaultTitle()}</h2>

        <p className="error-description">
          {description || getDefaultDescription()}
        </p>

        {error && (
          <div className="error-details">
            <p className="error-message">{error}</p>
          </div>
        )}

        <button
          onClick={handleRetry}
          className="error-retry-btn"
          aria-label={t("retryButton") || "Retry"}
        >
          <MdRefresh size={20} />
          <span>{t("retryButton") || "Try Again"}</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
