import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Scam Check",
  description: "Paste a suspicious message and find out if it's a scam.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
