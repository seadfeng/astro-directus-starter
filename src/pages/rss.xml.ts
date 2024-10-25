import rss from "@astrojs/rss";
import directus, { type PostStatus } from "lib/directus";
import { readItems } from "@directus/sdk";
import { siteConfig } from "@utils/getConfig";

export async function GET() {
  const config = await siteConfig();
  const posts = await directus.request(
    readItems("posts", {
      filter: {
        status: { _eq: "published" as PostStatus },
      },
      sort: ["-date_published"],
      limit: 100,
    })
  );
  return rss({
    title: config.meta_title!,
    description: config.meta_description!,
    site: config.website,
    items: posts.map(post => ({
      link: `posts/${post.slug}/`,
      title: post.title,
      description: post.content,
      pubDate: new Date(post.date_published ?? post.date_updated),
    })),
  });
}
