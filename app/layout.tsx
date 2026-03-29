import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JINJA MAPS",
  description: "Premium local discovery map demo for Jinja, Uganda."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
