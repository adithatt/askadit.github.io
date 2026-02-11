import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Adit — A collection of things I found interesting enough to remember",
  description:
    "A little repository of things I've learned along the way.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
