import "./globals.css";
import Link from "next/link";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { pageMeta, SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";

const font = Zen_Kaku_Gothic_New({ weight: ["400", "700"], preload: false, display: "swap" });

// 全ページ共通のメタ情報。各ページで上書きできる
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // og:image などの相対パスを絶対URLにするための基準
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  keywords: ["キオビエダシャク", "イヌマキ", "害虫", "大分", "大分県", "発生マップ", "食害"],
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
  ...pageMeta(null, SITE_DESC, "/"),
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#2d2140" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={font.className}>
        <nav className="nav">
          <strong>{SITE_NAME}</strong>
          <Link href="/">マップ</Link>
          <Link href="/knowledge">キオビエダシャクとは</Link>
          <Link href="/economy">経済損失</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
