import "../scss/main.scss";

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
      <body>{children}</body>
    </html>
  );
}
