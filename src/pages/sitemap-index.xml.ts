import { SITE } from "@config";
import getTotalCount from "@utils/getTotalCount";
import type { APIRoute } from "astro";
export const runtime = "edge";

export const GET: APIRoute = async () => {
  const totalPosts = await getTotalCount("posts");

  const totalSitemaps = Math.ceil(totalPosts / SITE.postPerSitemap);

  const sitemapItems = Array.from({ length: totalSitemaps }, (_, i) => {
    const pageNum = i + 1;
    return `
    <sitemap>
      <loc>${SITE.website}/sitemap-posts.xml?page=${pageNum}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
  `;
  }).join("");

  const sitemapIndex = `
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapItems}
    </sitemapindex>
  `.trim();

  return new Response(sitemapIndex, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
