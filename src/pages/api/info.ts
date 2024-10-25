import type { APIRoute } from "astro";
export const runtime = "edge";

export const GET: APIRoute = async () => {
  console.log("VITE_DIRECTUS_URL", import.meta.env.VITE_DIRECTUS_URL);
  console.log("CF_VITE_DIRECTUS_URL", import.meta.env.CF_VITE_DIRECTUS_URL);
  return new Response(
    JSON.stringify({
      astro_url: import.meta.env.VITE_ASTRO_URL,
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
