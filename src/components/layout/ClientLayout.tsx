"use client";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function ClientLayout({
  children,
  showHeader = true,
  showFooter = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}) {
  return (
    <>
      
      <div className="space" style={{ height: "100px" }}></div>
      {showHeader && <Header />}
      {children}
      {showFooter && <Footer />}
    </>
  );
}
