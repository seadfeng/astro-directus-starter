import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: import.meta.env.VITE_ASTRO_URL || "https://astro-paper.pages.dev", // replace this with your deployed domain
  author: import.meta.env.VITE_ASTRO_AUTHOR || "Sead",
  profile: import.meta.env.VITE_ASTRO_PROFILE || "https://github.com/seadfeng",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 3,
  postTruncateLength: 280, // For posts index
  postPerSitemap: 1000,
  tagPerPage: 50,
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};
