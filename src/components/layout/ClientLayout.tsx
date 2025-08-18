"use client";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ThemeProvider from "../providers/ThemeProvider";
import SEOProvider from "../providers/SEOProvider";

export default function ClientLayout({
  children,
  showHeader = true,
  showFooter = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}) {
  const isNeedSpace = showHeader;
  return (
    <ThemeProvider>
      <SEOProvider>
        {isNeedSpace && <div className="space" style={{ height: "100px" }}></div>}
        {showHeader && <Header />}
        {children}
        {showFooter && <Footer />}
      </SEOProvider>
    </ThemeProvider>
  );
}
