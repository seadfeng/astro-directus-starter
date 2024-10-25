import { SITE } from "@config";
import { readItems } from "@directus/sdk";
import type { APIRoute } from "astro";
import directus, { type Posts } from "lib/directus";
export const runtime = "edge";

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params as { slug: string };
  let collection: Posts[] = [];

  // Check if slug is a number to determine pagination or filtering by slug
  if (!isNaN(Number(slug))) {
    collection = await directus.request(
      readItems("posts", {
        limit: SITE.postPerPage,
        page: parseInt(slug, 10),
        sort: ["-date_published"],
      })
    );
  } else {
    collection = await directus.request(
      readItems("posts", {
        filter: {
          slug: { _eq: slug },
        },
        limit: 1,
      })
    );
  }

  // Return a 404 Not Found if no posts are found
  if (collection.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const post = collection[0];

  // If the post has a cover, redirect to the cover URL
  if (post.cover) {
    const coverUrl = `/assets/${post.cover}`;
    return new Response(null, {
      status: 302, // Temporary redirect
      headers: {
        Location: coverUrl,
      },
    });
  }

  // Return a 404 Not Found if the post does not have a cover
  return new Response("Not found", { status: 404 });
};
