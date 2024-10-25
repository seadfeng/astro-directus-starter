import type socialIcons from "@assets/socialIcons";

export type Site = {
  website: string;
  author: string;
  profile: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  postPerSitemap: number;
  postTruncateLength: number;
  tagPerPage: number;
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  linkTitle: string;
}[];

export type ResponseInfo = {
  url: string;
  host: string;
  status: number;
  statusText: string;
  duration: string;
  location: string | null;
  metaRefresh: boolean;
};
