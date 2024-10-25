import { SITE } from "@config";
import { readItems } from "@directus/sdk";
import type { APIRoute } from "astro";
import directus, { type PostStatus } from "lib/directus";
export const runtime = "edge";

export const GET: APIRoute = async ({ request }) => {
  const { url } = request;
  const newUrl = new URL(url);
  const q = newUrl.searchParams.get("q");
  if (!q) {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const posts = await directus.request(
    readItems("posts", {
      limit: SITE.postPerPage,
      filter: {
        title: { _icontains: q },
        status: { _eq: "published" as PostStatus },
      },
      sort: ["views", "-date_published"],
    })
  );
  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const ALL: APIRoute = () => {
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
