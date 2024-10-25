import { SITE } from "@config";
import type { APIRoute } from "astro";
export const runtime = "edge";

export const GET: APIRoute = async () => {
  console.log("VITE_DIRECTUS_URL", import.meta.env.VITE_DIRECTUS_URL);
  return new Response(
    JSON.stringify({
      astro_url: SITE.website,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const ALL: APIRoute = () => {
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
