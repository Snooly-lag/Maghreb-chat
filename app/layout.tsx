import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maghreb Chat",
  description: "A Moroccan-inspired social chat application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
