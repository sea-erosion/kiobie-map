import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /robots.txt を自動で作る。全ページの巡回を許可し、サイトマップの場所を伝える
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
