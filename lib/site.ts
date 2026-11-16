import type { Metadata } from "next";

export const SITE_NAME = "大分 キオビエダシャクマップ";
export const SITE_DESC =
  "イヌマキを食い荒らす外来の蛾「キオビエダシャク」の大分県内の発生状況を、地図のピンで共有できるサイトです。現在地や住所からかんたんに投稿できます。";

// サイトのURL。NEXT_PUBLIC_SITE_URL を設定すれば独自ドメインを優先。
// なければVercelが自動で入れる本番URLを使う。どちらもなければローカル。
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

// ページごとのメタ情報を作る。OGP（LINE・Instagram・Facebook等が読む）と
// Twitterカード（X）の両方を、同じ内容でまとめて作る。
export function pageMeta(title: string | null, description: string, path: string): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const image = { url: "/og.png", width: 1200, height: 630, alt: SITE_NAME };
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "ja_JP", siteName: SITE_NAME, title: fullTitle, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/og.png"] },
  };
}
