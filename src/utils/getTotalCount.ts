import { aggregate, type AllCollections } from "@directus/sdk";
import type { PostStatus, Schema } from "lib/directus";
import directus from "lib/directus";

const getTotalCount = async (model: AllCollections<Schema>) => {
  const totalCount = await directus.request(
    aggregate(model, {
      filter: {
        status: { _eq: "published" as PostStatus },
      },
      aggregate: { count: "*" },
    })
  );
  return totalCount[0].count ? parseInt(totalCount[0].count, 10) : 0;
};

export default getTotalCount;
