import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { Posts } from "lib/directus";
import { stripHtmlTags } from "@utils/htmlUtils";
import { SITE } from "@config";
import he from "he";

export interface Props {
  href?: string;
  frontmatter: Posts;
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, date_published, date_updated, content } = frontmatter;
  const decodedContent = he.decode(content);
  let description = stripHtmlTags(decodedContent).slice(
    0,
    SITE.postTruncateLength
  );
  if (description.length >= SITE.postTruncateLength) description += "...";
  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime date_published={date_published} date_updated={date_updated} />
      <p>{description}</p>
    </li>
  );
}
