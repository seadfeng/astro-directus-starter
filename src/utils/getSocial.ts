 import { socials, Socials, type Profiles, type Social } from "lib/directus";
import type { SocialObjects } from "types";

export const getSocial = ({social, name, site_name}: {social: Social; name: string; site_name: string; }): SocialObjects[number] => {
  const social_name = Socials[social] as SocialObjects[number]["name"];
  let social_url = "";
  switch(social) {
    case "github":
      social_url = `https://www.github.com/${name}`;
      break;
    case "twitter":
      social_url = `https://twitter.com/${name}`;
      break;
    case "facebook":
      social_url = `https://www.facebook.com/${name}`;
      break;
    case "instagram":
      social_url = `https://www.instagram.com/${name}`;
      break;
    case "linkedin":
      social_url = `https://www.linkedin.com/${name}`;
      break;
    case "youtube":
      social_url = `https://www.youtube.com/${name}`;
      break;
    case "tiktok":
      social_url = `https://www.tiktok.com/${name}`;
      break;
    case "pinterest":
      social_url = `https://www.pinterest.com/${name}`;
      break;
    case "mail":
      social_url = `mailto:${name}`;
      break;
    case "codepen":
      social_url = `https://codepen.io/${name}`;
      break;
    case "discord":
      social_url = `https://discord.gg/${name}`;
      break;
    case "gitLab":
      social_url = `https://gitlab.com/${name}`;
      break;
    case "mastodon":
      social_url = `https://mastodon.social/${name}`;
      break;
    case "reddit":
      social_url = `https://www.reddit.com/${name}`;
      break;
    case "skype":
      social_url = `skype:${name}?chat`;
      break;
    case "snapchat":
      social_url = `https://www.snapchat.com/${name}`;
      break;
    case "steam":
      social_url = `https://steamcommunity.com/${name}`;
      break;
    case "telegram":
      social_url = `https://t.me/${name}`;
      break;
    case "twitch":
      social_url = `https://www.twitch.tv/${name}`;
      break;
    case "whatsapp":
      social_url = `https://wa.me/${name}`;
      break;
    default:
      throw new Error(`Social media platform '${social}' not found`);
  }

  return {
    name: social_name,
    linkTitle: `${social === "mail" ? `Send an email to ${site_name}` : `${site_name} on ${social_name}` }`,
    href: social_url
  }
} 

export const getSocialObjects = ({profile, site_name}:{ profile: Profiles, site_name: string;}): SocialObjects =>{
  const socialObjects: SocialObjects = [];
  socials.forEach(social =>{
    if(profile[social]) socialObjects.push(getSocial({social, site_name: site_name, name: profile[social]}));
  })
  return socialObjects;
}