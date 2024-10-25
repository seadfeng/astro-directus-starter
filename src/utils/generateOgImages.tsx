import { type CollectionEntry } from "astro:content";
import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  return await postOgImage(post);
}

export async function generateOgImageForSite() {
  return await siteOgImage();
}
