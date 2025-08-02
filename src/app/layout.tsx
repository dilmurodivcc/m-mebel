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
      </head>
      <body>
        <Suspense fallback={<Loading />}>
          <div className="container">{children}</div>
        </Suspense>
      </body>
    </html>
  );
}
