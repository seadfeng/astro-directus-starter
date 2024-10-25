import kebabcase from "lodash.kebabcase";

export const canonicalURL = (str: string) => {
  return `${import.meta.env.VITE_ASTRO_URL}${str}`;
};

export const slugifyStr = (str: string) => kebabcase(str);

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
