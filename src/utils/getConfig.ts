import { readItem } from "@directus/sdk";
import directus, { type Config, type Profiles } from "../lib/directus";

export type LayoutProps = {
  title: string;
  author: string;
  favicon: string;
  site_name: string;
  profile: Profiles;
  profile_url?: string;
  description: string;
  ogImage?: string;
  canonicalURL?: string;
  date_published?: Date;
  date_updated?: Date | null;
  scrollSmooth?: boolean;
  site_config?: Config;
};

export const siteConfig = async (): Promise<Config> => {
  return (await directus.request(
    // @ts-expect-error: Suppressing type error for demonstration purposes
    readItem("config", 1, {
      fields: [
        "*",
        {
          profile: ["*"],
        },
      ],
    })
  )) as Config;
};

export const layoutProps = async (
  props?: LayoutProps
): Promise<LayoutProps> => {
  const config = await siteConfig();
  const profile = config.profile as Profiles;
  let defaultProps = {
    site_config: config,
    site_name: config.site_name!,
    title: config.meta_title!,
    profile: profile,
    author: profile.name ? profile.name : config.site_name!,
    description: config.meta_description!,
    ogImage: config.og_image ? `/assets/${config.og_image}` : undefined,
    profile_url: config.profile_url
      ? config.profile_url
      : import.meta.env.VITE_ASTRO_URL,
    favicon: config.favicon ? `/assets/${config.favicon}` : "/favicon.svg",
  };
  if (props) {
    defaultProps = {
      ...defaultProps,
      ...props,
    };
  }
  return defaultProps;
};
