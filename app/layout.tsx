import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SN Mart",
  description: "Convenience Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
