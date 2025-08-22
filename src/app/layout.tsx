import "../scss/main.scss";
import { Suspense } from "react";
import Loading from "./loading";
import I18nProvider from "../components/providers/I18nProvider";
import { Metadata } from "next";
import API from "../API";

// Fetch global data for metadata
async function getGlobalData() {
  try {
    const response = await API.get(
      "/api/global?populate[0]=favicon&populate[1]=defaultSeo&populate[2]=seoImg"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch global data for metadata:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getGlobalData();

  const siteName = globalData?.data?.siteName || "M-Mebel";
  const siteDescription =
    globalData?.data?.siteDescription ||
    "Мебель | Широкий выбор и высокое качество!";
  const keywords = globalData?.data?.defaultSeo?.keywords || "мебель, M-Mebel";
  const faviconUrl = globalData?.data?.favicon?.url || "/favicon.png";
  const seoImageUrl = globalData?.data?.seoImg?.url || "";

  return {
    title: siteName,
    description: siteDescription,
    keywords: keywords,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    viewport: "width=device-width, initial-scale=1",
    openGraph: {
      title: siteName,
      description: siteDescription,
      type: "website",
      url: "https://mabel.uz",
      siteName: siteName,
      images: seoImageUrl
        ? [
            {
              url: seoImageUrl,
              width: globalData?.data?.seoImg?.width || 600,
              height: globalData?.data?.seoImg?.height || 600,
              alt: siteName,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: seoImageUrl ? [seoImageUrl] : [],
    },
    alternates: {
      canonical: "https://mabel.uz",
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL("https://mabel.uz"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Suspense fallback={<Loading />}>
            <div className="container">{children}</div>
          </Suspense>
        </I18nProvider>
      </body>
    </html>
  );
}
