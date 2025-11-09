import type { Metadata } from "next";
import "./globals.css";  // 만약 globals.css가 src/app에 있다면 import (Tailwind용, 없으면 생략)

export const metadata: Metadata = {
  title: "Simple Voting App",
  description: "A Web3 voting app on Sepolia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">  {/* Tailwind 클래스 추가 */}
      <body>{children}</body>
    </html>
  );
}
