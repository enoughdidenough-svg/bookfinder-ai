import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookFinder AI",
  description: "Find, read, and study books with AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
