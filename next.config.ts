import type { NextConfig } from "next";

// 同じコードで「Vercel版」と「GitHub Pages版（静的）」の両方を作る。
// STATIC_EXPORT=1 のときだけ、静的ファイルとして書き出す（out/ フォルダができる）。
const isStatic = process.env.STATIC_EXPORT === "1";

const config: NextConfig = {};

if (isStatic) {
  config.output = "export";          // 静的書き出し
  config.trailingSlash = true;       // /knowledge → /knowledge/index.html になり、GitHub Pagesで確実に開ける
  config.images = { unoptimized: true };
}
// GitHub Pagesは https://ユーザー名.github.io/リポジトリ名/ に置かれるので、その分の道筋を付ける
if (process.env.NEXT_PUBLIC_BASE_PATH) config.basePath = process.env.NEXT_PUBLIC_BASE_PATH;

export default config;
