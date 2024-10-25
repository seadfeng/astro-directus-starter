import type { APIRoute } from "astro";
import { type ResponseInfo } from "types";
import { z } from "zod";
export const runtime = "edge";

// Define a schema for the request body using Zod for validation
const BodySchema = z.object({
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
});

// Fetches a URL and returns detailed information about the response.
const fetchUrl = async ({
  url,
  headers,
}: {
  url: string;
  headers?: Headers;
}): Promise<ResponseInfo> => {
  const startTime = Date.now();
  const newUrl = new URL(url);
  let metaRefresh = false;

  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers,
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(3);

  let location: string | null = null;

  if ([301, 302].includes(response.status)) {
    location = response.headers.get("location");
  } else {
    const body = await response.text();
    const match1 = body.match(
      /<meta[^>]*?http-equiv=["']refresh["'][^>]*?content=["']\d*;\s*url=([^"']*)["'][^>]*?>/
    );
    if (match1 && match1[1]) {
      location = match1[1];
      metaRefresh = true;
    } else {
      const match2 = body.match(
        /<meta[^>]*?content=["']\d*;\s*url=([^"']*)["'][^>]*?http-equiv=["']refresh["'][^>]*?>/
      );
      if (match2 && match2[1]) {
        location = match2[1];
        metaRefresh = true;
      }
    }
  }

  return {
    url,
    host: newUrl.host,
    status: response.status,
    statusText: response.statusText,
    duration: `${duration} s`,
    metaRefresh,
    location,
  };
};

export const POST: APIRoute = async ({ request }) => {
  let url: string;
  let headers: HeadersInit | undefined;
  const body = await request.json();
  try {
    ({ url, headers } = BodySchema.parse(body));
    headers = headers ? new Headers(headers) : new Headers();
  } catch (error: any) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let process = true;
  const data: ResponseInfo[] = [];
  if (headers instanceof Headers) {
    headers.delete("Content-Length");
  }

  const maxTry = 10;
  let i = 0;

  while (process && i < maxTry) {
    try {
      const responseInfo = await fetchUrl({ url, headers });
      data.push(responseInfo);

      if (responseInfo.location) {
        url = responseInfo.location;
      } else {
        process = false;
      }

      i++;
    } catch (error) {
      console.error(error);
      data.push({
        url,
        host: new URL(url).host,
        status: 0,
        statusText: "Fetch failed",
        duration: "N/A",
        metaRefresh: false,
        location: null,
      });
      process = false;
    }
  }

  return new Response(JSON.stringify(data), {
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
