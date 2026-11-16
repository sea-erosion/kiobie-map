import "./globals.css";
import Link from "next/link";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import type { ReactNode } from "react";

const font = Zen_Kaku_Gothic_New({ weight: ["400", "700"], preload: false, display: "swap" });

export const metadata = { title: "大分 キオビエダシャクマップ" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={font.className}>
        <nav className="nav">
          <strong>大分 キオビエダシャクマップ</strong>
          <Link href="/">マップ</Link>
          <Link href="/knowledge">キオビエダシャクとは</Link>
          <Link href="/economy">経済損失</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
