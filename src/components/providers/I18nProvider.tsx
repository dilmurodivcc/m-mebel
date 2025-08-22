"use client";

import "../../i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Return children immediately without full-screen loading
  return <>{children}</>;
};

export default I18nProvider;
