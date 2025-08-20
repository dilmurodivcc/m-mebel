"use client";

import React from "react";

interface SmoothLoadingIndicatorProps {
  isFetching: boolean;
  children: React.ReactNode;
  className?: string;
}

const SmoothLoadingIndicator: React.FC<SmoothLoadingIndicatorProps> = ({
  isFetching,
  children,
  className = "",
}) => {
  return (
    <div className={`smooth-loading-container ${className}`}>
      {children}
      {isFetching && (
        <div className="smooth-loading-overlay">
          <div className="smooth-loading-spinner">
            <div className="smooth-loading-dot"></div>
            <div className="smooth-loading-dot"></div>
            <div className="smooth-loading-dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmoothLoadingIndicator;
