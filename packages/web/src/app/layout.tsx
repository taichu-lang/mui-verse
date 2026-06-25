import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anna AI",
  description: "Anna AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
