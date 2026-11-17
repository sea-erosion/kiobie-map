import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// /sitemap.xml を自動で作る。検索エンジンにページ一覧を教える
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/knowledge", "/economy"].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.6 }));
}
