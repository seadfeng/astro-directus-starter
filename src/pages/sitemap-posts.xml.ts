import type { APIRoute } from "astro";
import directus, { type PostStatus } from "lib/directus";
import { readItems } from "@directus/sdk";
import { SITE } from "@config";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const posts = await directus.request(
    readItems("posts", {
      fields: ["slug", "date_published", "date_updated"],
      filter: {
        status: { _eq: "published" as PostStatus },
      },
      sort: ["-date_created"],
      page: parseInt(page, 10),
      limit: 100,
    })
  );

  const sitemapItems = posts
    .map(
      post => `
    <url>
      <loc>${SITE.website}/posts/${post.slug}/</loc>
      <lastmod>${new Date(post.date_updated || post.date_published).toISOString()}</lastmod>
    </url>
  `
    )
    .join("");

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemapItems}
    </urlset>
  `.trim();

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
