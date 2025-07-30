"use client";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ThemeProvider from "../providers/ThemeProvider";

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
      {isNeedSpace && <div className="space" style={{ height: "100px" }}></div>}
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </ThemeProvider>
  );
}
