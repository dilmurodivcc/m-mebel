import "../scss/main.scss";
import { Suspense } from "react";
import Loading from "./loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Mabel</title>
        <meta
          name="description"
          content="Мебель | Широкий выбор и высокое качество!"
        />
        <meta name="keywords" content="мебель" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Mabel" />
        <meta
          property="og:description"
          content="Мебель | Широкий выбор и высокое качество!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="" />
      </head>
      <body>
          <Suspense fallback={<Loading />}>
            <div className="container">{children}</div>
          </Suspense>
      </body>
    </html>
  );
}
